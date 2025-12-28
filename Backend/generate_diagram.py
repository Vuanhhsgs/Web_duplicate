








from flask import Flask, render_template, request, jsonify
import os
from PIL import Image
import pytesseract
import pdfplumber
import io


app = Flask(__name__, template_folder="../Front end", static_folder="../Front end", static_url_path='')

def get_Listofcommand_fromproblem(problem):
    return problem
    #will edit later

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json() 
    commands = get_Listofcommand_fromproblem(data)
    return jsonify(result=commands)

# New endpoint for file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(error="No file uploaded"), 400
    file = request.files['file']
    text = ""
    if file.filename.endswith(".pdf"):
        with pdfplumber.open(file) as pdf:
            text = "\n".join(page.extract_text() for page in pdf.pages)
    elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        img = Image.open(file)
        text = pytesseract.image_to_string(img)
    else:
        text = file.read().decode("utf-8")
    return jsonify(text=text)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
