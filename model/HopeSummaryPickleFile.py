import numpy as np
import pandas as pd
import json
import re
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
from transformers import pipeline
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')


class ResearchPaperSummariser:

    def __init__(self, corpus):
        self.Pdf = corpus

    # def filter_sections(self, selected_sections = [], removed_sections = []):

    def Generate_Processed_Corpus(self):
        pdf = self.Pdf  # json.load(f)

        # cleaning and preprocessing the corpus, filtering relevant data for processing
        select_sections = []
        remove_sections = []
        key_list = list(pdf.keys())
        for i in range(len(key_list)):
            if key_list[i].isalpha() == True:
                select_sections.append(key_list[i])
            else:
                pattern = r'^(\d+\.){1,3}(\s.*)$'
                matches = re.findall(pattern, key_list[i])
                # print(matches)
                if matches != []:
                    if int(matches[0][0].split('.')[0]) < 10:
                        matches[0][1].strip()
                        if pdf[key_list[i]] != '':
                            select_sections.append(key_list[i])
                        else:
                            remove_sections.append(key_list[i])
                    else:
                        pdf[key_list[i-1]] = pdf[key_list[i-1]] + \
                            key_list[i] + pdf[key_list[i]]
                        remove_sections.append(key_list[i])
                else:
                    remove_sections.append(key_list[i])
        # removing unwanted sections
        [pdf.pop(i) for i in remove_sections]

        # collection of word count section wise
        pdf_section_WordCount = {}
        for key in select_sections:
            text_len = len(pdf[key].split())
            pdf_section_WordCount[key] = text_len
            #print ("The number of words in the given section - ", key, ' : '+  str(text_len))

    #     pdf_docs = {}
    #     for section in pdf:
    #         text = pdf[section]
    #         if pdf_section_WordCount[section] > 350:
    #             pdf_docs[section] = nlp(text)
    #         else:
    #             pdf_docs[section] = text

    #     pdf_tokens = {}
    #     for section in pdf_docs:
    #         if pdf_section_WordCount[section] > 350:
    #             tokens=[token.text for token in pdf_docs[section]]
    #             print(tokens)
    #             pdf_tokens[section] = tokens
    #         else:
    #             pdf_tokens[section] = pdf_docs[section]

        # Corpus as a dictionary
        corpus = pdf

        # Preprocess and tokenize the documents
        stop_words = set(stopwords.words('english'))
        #stemmer = PorterStemmer()
        #lemmatizer = WordNetLemmatizer()

        tokenized_corpus = {}
        for key, value in corpus.items():
            # Remove punctuation and convert to lowercase
            value = value.lower()
            # print(value)
            # Tokenize into sentences
            sentences = nltk.sent_tokenize(value)
            # print(sentences)
            # Tokenize sentences into words, remove stop words, perform stemming or lemmatization
            tokenized_sentences = []
            for sentence in sentences:
                words = nltk.word_tokenize(sentence)
                words = [word for word in words if word.isalpha()
                         and word not in stop_words]
                tokenized_sentences.append(" ".join(words))
            tokenized_corpus[key] = tokenized_sentences

        # Calculate TF-IDF scores
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(
            [sentence for document in tokenized_corpus.values() for sentence in document])

        # Rank sentences within each document
        final_paper_corpus = {}
        for document_key, sentences in tokenized_corpus.items():
            document_index = list(corpus.keys()).index(document_key)
            sentence_scores = cosine_similarity(
                tfidf_matrix[document_index], tfidf_matrix)[0]
            ranked_sentences = sorted(((score, sentence) for score, sentence in zip(
                sentence_scores, sentences)), reverse=True)

            # Determine the number of sentences to select based on the desired percentage
            num_sentences = int(len(ranked_sentences) * 0.4)

            final_paper_corpus[document_key] = ''
            print(f"Document: {document_key}")
            if pdf_section_WordCount[document_key] > 400:
                for score, sentence in ranked_sentences[:num_sentences]:
                    final_paper_corpus[document_key] = final_paper_corpus[document_key] + sentence
                    print(f"Score: {score:.3f}\tSentence: {sentence}")
                print("\n")
            else:
                final_paper_corpus[document_key] = ''
                for score, sentence in ranked_sentences:
                    final_paper_corpus[document_key] = final_paper_corpus[document_key] + sentence
                    print(f"Score: {score:.3f}\tSentence: {sentence}")
                print("\n")

        return final_paper_corpus

    def Generate_Summary(self, processed_corpus):
        return_summary = {}
        summarization = pipeline("summarization")
        for i in processed_corpus:
            original_text = processed_corpus[i]
            summary_text = summarization(original_text)[0]['summary_text']
            return_summary[i] = summary_text
        return return_summary
