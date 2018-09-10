# Workflow example for associated_press_docs

This example is inspired by https://github.com/treasure-data/workflow-examples/tree/master/machine-learning/lda .


## Usage

```
$ % ./bin/load_data.sh

$ td wf push lda_wf

$ td wf secrets --project lda_wf --set python_apikey

$ td wf start lda_wf lda --session now
```
