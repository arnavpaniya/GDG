"""
app.py
======
Production-ready Flask API for Nyaya AI ML Service.
Designed for deployment on Google Cloud Run.

Routes
------
  GET  /          → service info
  GET  /health    → health check (used by Cloud Run liveness probe)
  POST /predict   → run full bias-detection + mitigation pipeline
  POST /analyze   → alias for /predict (backward-compat with Node backend)
"""

from __future__ import annotations

import os
import sys
import logging
import traceback

# ── Ensure nyaya_ai package is importable ─────────────────────────────────── #
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, request, jsonify

from nyaya_ai.pipeline import run_pipeline
from nyaya_ai.explainer import generate_plain_english_insights

# ── Logging ───────────────────────────────────────────────────────────────── #
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────── #
app = Flask(__name__)


# ── Helpers ───────────────────────────────────────────────────────────────── #

def _serialize_metrics(metrics: dict, dataset_label: str) -> dict:
    """
    Convert a fairness metrics dict (from compute_fairness_metrics) into
    a clean, JSON-serialisable structure.
    """
    return {
        "selection_rates":  {k: round(float(v), 4) for k, v in metrics["selection_rates"].items()},
        "disparate_impact": round(float(metrics["disparate_impact"]), 4),
        "fairness_score":   int(metrics["fairness_score"]),
        "bias_exists":      bool(metrics["bias_exists"]),
        "verdict":          metrics["verdict"],
        "disadvantaged":    metrics["disadvantaged"],
        "privileged":       metrics["privileged_group"],
        "insights":         generate_plain_english_insights(metrics, dataset_label=dataset_label),
    }


def _run_and_build_response(dataset: str, mitigation: str) -> dict:
    """
    Execute the pipeline and return a fully serialisable response dict.
    Shared by /predict and /analyze.
    """
    log.info("Running pipeline — dataset=%s  mitigation=%s", dataset, mitigation)

    result = run_pipeline(dataset_key=dataset, mitigation=mitigation)

    before = result["before_metrics"]
    after  = result["after_metrics"]

    di_delta = round(float(after["disparate_impact"]) - float(before["disparate_impact"]), 4)
    fs_delta = int(after["fairness_score"]) - int(before["fairness_score"])

    return {
        "dataset":    dataset,
        "mitigation": mitigation,
        "before":     _serialize_metrics(before, dataset_label=f"'{dataset}' dataset (baseline)"),
        "after":      _serialize_metrics(after,  dataset_label="mitigated model"),
        "comparison": {
            "di_delta": di_delta,
            "fs_delta": fs_delta,
            "improved": fs_delta > 0,
        },
    }


# ── Routes ────────────────────────────────────────────────────────────────── #

@app.route("/", methods=["GET"])
def index():
    """Service info — confirms the container is alive."""
    return jsonify({
        "service": "Nyaya AI ML Service",
        "version": "1.0.0",
        "status":  "running",
        "routes": {
            "GET  /health":  "Liveness probe",
            "POST /predict": "Run bias-detection + mitigation pipeline",
            "POST /analyze": "Alias for /predict (backward-compat)",
        },
    }), 200


@app.route("/health", methods=["GET"])
def health():
    """
    Liveness / readiness probe used by Cloud Run.
    Must return 200 quickly — no heavy computation here.
    """
    return jsonify({"status": "ok", "service": "Nyaya AI"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    Run the full Nyaya AI bias-detection + mitigation pipeline.

    Request body (JSON)
    -------------------
    {
        "dataset":    "biased" | "fair"           (default: "biased")
        "mitigation": "reweighting" | "smote"     (default: "reweighting")
    }

    Response (JSON)
    ---------------
    {
        "dataset":    str,
        "mitigation": str,
        "before": {
            "selection_rates":  { "Male": 0.325, "Female": 0.098 },
            "disparate_impact": 0.3015,
            "fairness_score":   30,
            "bias_exists":      true,
            "verdict":          "🚨  HIGH BIAS",
            "disadvantaged":    "Female",
            "privileged":       "Male",
            "insights":         [ "..." ]
        },
        "after": { ... same shape ... },
        "comparison": {
            "di_delta": 0.4825,
            "fs_delta": 48,
            "improved": true
        }
    }
    """
    try:
        body = request.get_json(force=True, silent=True) or {}

        dataset    = body.get("dataset",    "biased")
        mitigation = body.get("mitigation", "reweighting")

        # Validate inputs
        valid_datasets   = {"biased", "fair"}
        valid_mitigation = {"reweighting", "smote"}

        if dataset not in valid_datasets:
            return jsonify({
                "error": f"Invalid dataset '{dataset}'. Valid options: {sorted(valid_datasets)}"
            }), 400

        if mitigation not in valid_mitigation:
            return jsonify({
                "error": f"Invalid mitigation '{mitigation}'. Valid options: {sorted(valid_mitigation)}"
            }), 400

        response = _run_and_build_response(dataset, mitigation)
        log.info("Pipeline complete — fairness_score before=%d after=%d",
                 response["before"]["fairness_score"],
                 response["after"]["fairness_score"])

        return jsonify(response), 200

    except FileNotFoundError as exc:
        log.error("Dataset file not found: %s", exc)
        return jsonify({"error": str(exc)}), 404

    except Exception:
        tb = traceback.format_exc()
        log.error("Unhandled exception in /predict:\n%s", tb)
        return jsonify({"error": "Internal server error", "detail": tb}), 500


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Backward-compatible alias for /predict.
    The Node.js backend currently calls /analyze — this keeps it working
    without any changes to the backend.
    """
    return predict()


# ── Entry point ───────────────────────────────────────────────────────────── #

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    log.info("Starting Nyaya AI ML Service on port %d", port)
    app.run(host="0.0.0.0", port=port, debug=False)
