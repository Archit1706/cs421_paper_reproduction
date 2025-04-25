# Reproducibility of "Hateful Word in Context Classification" (EMNLP 2024)

This repository contains our reproduction of the EMNLP 2024 paper titled **"Hateful Word in Context Classification."** The main objective is verifying key claims from the original paper, specifically:

-   Performance of HateBERT with word-in-context (WiC) embeddings for subjective hatefulness prediction (HateWiC).
-   Accuracy in pejorative usage classification tasks (DINU1 and DINU2).

---

## 📂 Project Structure

```
PAPER-REPRODUCIBILITY/
│
├── code/
│   ├── classification.py           # Classification methods (MLP and Dimensional projection)
│   ├── dinu_eval.py                # Evaluation code for DINU tasks (5-fold cross-validation)
│   ├── embeddings.py               # Embedding generation (WiC, Def, Ann embeddings)
│   ├── tenfold_eval.py             # Evaluation code for HateWiC (10-fold cross-validation)
│   └── run.py                      # Main script to orchestrate full experimental runs
│
├── datasets/                       # Raw and preprocessed datasets
├── embeddings/                     # Generated embeddings files
├── predictions/                    # Prediction results from evaluation scripts
├── logs/                           # Detailed logs for evaluation runs
├── plots/                          # Visualization of results
├── notebooks/                      # Jupyter notebooks used for additional analyses
├── README.md                       # Project overview
└── requirements.txt                # Python dependencies
```

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Archit1706/cs421_paper_reproduction.git
cd cs421_paper_reproduction
```

### 2. Environment Setup

Create a virtual environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
.\venv\Scripts\activate    # Windows

pip install -r requirements.txt
```

### 3. Running Experiments

Use `run.py` to reproduce experiments:

**Example: HateWiC (10-fold cross-validation)**

```bash
python code/run.py \
  --data_path datasets/hatewic_individual_clean.csv \
  --id_column id \
  --label_column binary_label \
  --embedding_dir embeddings/ \
  --predictions_dir predictions/ \
  --logs_path logs/hatewic_individual_eval.log \
  --models GroNLP/hateBERT \
  --model_layers last \
  --clf mlp \
  --embedding_types example \
  --splitby id \
  --params '{"hidden_layer_sizes": [300, 200, 100, 50], "learning_rate_init": 0.0005, "max_iter": 10}' \
  --random_split_seed 12
```

**Example: DINU Task**

```bash
python code/run.py \
  --data_path datasets/dinu1_clean.csv \
  --label_column binary_label \
  --embedding_dir embeddings/ \
  --predictions_dir predictions/ \
  --models GroNLP/hateBERT \
  --model_layers last \
  --clf mlp \
  --embedding_types example \
  --task dinu \
  --params '{"hidden_layer_sizes": [300, 200, 100, 50], "learning_rate_init": 0.0005, "max_iter": 10}' \
  --random_split_seed 12
```

### 4. Results and Logs

Check the `predictions/` and `logs/` directories for detailed evaluation results.

---

## 📊 Visualizations and Analysis

Check the `plots/` directory and `notebooks/main.ipynb` for detailed analyses and visualizations, including confusion matrices and error-term plots.

---

## 🛠️ Dependencies

-   Python 3.10+
-   PyTorch 2.1+
-   HuggingFace Transformers
-   Scikit-learn
-   Pandas
-   tqdm

Install dependencies via:

```bash
pip install -r requirements.txt
```

---

## ✉️ Authors

-   **Archit Rathod** – arath21@uic.edu
-   **Mokshit Surana** – msura4@uic.edu

---

## 📖 Original Paper and Resources

-   **Paper**: [Hateful Word in Context Classification (EMNLP 2024)](https://aclanthology.org/2024.emnlp-main.10/)
-   **HateBERT Model**: [GroNLP/hateBERT](https://huggingface.co/GroNLP/hateBERT)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
