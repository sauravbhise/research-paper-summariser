import pandas as pd
from flask import Flask, jsonify, request
import pickle
from HopeSummaryPickleFile import ResearchPaperSummariser

# load model
model = pickle.load(open('./HopeSummaryPickleFile.pkl', 'rb'))

# app
app = Flask(__name__)

# routes


@app.route('/summarize', methods=['POST'])
def predict():
    # get data from request
    data = request.get_json(force=True)
    original_text = data['original_text']

    test = ResearchPaperSummariser(original_text)
    processed = test.Generate_Processed_Corpus()
    final = test.Generate_Summary(processed_corpus=processed)

    # send back to browser
    output = {'results': final}

    # return data
    return jsonify(results=output)


if __name__ == '__main__':
    app.run(port=4000, debug=True)
