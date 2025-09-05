import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import librosa
import os
import base64
import requests
# Load saved features and file paths only once
features = np.load("app/model/mfcc_index.npy")
file_paths = np.load("app/model/file_paths.npy", allow_pickle=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "data")


def extract_mfcc(file_path, sr=16000, n_mfcc=13):
    try:
        y, _ = librosa.load(file_path, sr=sr)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        return np.mean(mfcc.T, axis=0)
    except Exception as e:
        print("Error while extracting_mfcc",e)

def getAudioFilesFromResult(filePath:str):
    try:
        filePathArray = filePath.split("/")
        folderName = filePathArray[-2]
        fileName = filePathArray[-1]
        raw_url = f"https://raw.githubusercontent.com/soerenab/AudioMNIST/master/data/{folderName}/{fileName}"
        resp = requests.get(raw_url)
        resp.raise_for_status()
        audio_bytes = resp.content
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        return audio_b64
    
    except Exception as e:
        print("Error while getting the audio file",e)
        return None

def retrieve_similar(file_path, top_k=5):
    try:
        query_vec = extract_mfcc(file_path).reshape(1, -1)
        similarities = cosine_similarity(query_vec, features)[0]
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        allAudioFiles = []
        for i in top_indices:
            audioFile = getAudioFilesFromResult(str(file_paths[i]))    
            allAudioFiles.append(audioFile)
        return allAudioFiles

    except Exception as e:
        print("Error while retrieving",e)
        return []

