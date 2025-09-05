import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaUpload, FaCheckCircle } from 'react-icons/fa';
import AudioPlayer from './audioPlayer';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === 'audio/mpeg' || selected.type === 'audio/wav')) {
      setPreviewUrl(URL.createObjectURL(selected));
      setFile(selected);
      setApiResponse('');
      toast.success('File uploaded successfully');
    } else {
      toast.error('Only .mp3 or .wav files are allowed');
      setFile(null);
      setApiResponse('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a valid audio file');
      return;
    }

    setIsLoading(true);
    setApiResponse('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        timeout: 20000,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setApiResponse(res.data);
      toast.success('Analysis complete!');
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        toast.error('API timeout');
      } else {
        toast.error('Failed to analyze the audio');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden px-4">
      <Toaster />

      {/* Decorative Bubbles */}
      <div className="absolute transform -translate-x-[-2rem] -translate-y-[4rem] top-1 right-1 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>
      <div className="absolute transform -translate-x-[2rem] -translate-y-[-4rem] bottom-1 left-1 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>

      {/* Upload Box */}
      <div className="z-10 bg-white shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col items-center gap-4 text-center">
        <label className="w-full cursor-pointer border-2 border-dashed border-blue-500 rounded-lg p-6 hover:bg-blue-50 transition flex flex-col items-center justify-center">
          {file ? (
            <>
              <FaCheckCircle className="text-green-500 text-3xl" />
              <p className="text-sm mt-2 text-gray-700 font-medium">{file.name}</p>
            </>
          ) : (
            <>
              <FaUpload className="text-blue-500 text-3xl" />
              <p className="text-sm mt-2 text-gray-600">Click to upload</p>
            </>
          )}
          <input type="file" accept=".mp3, .wav" onChange={handleFileChange} hidden />
        </label>

        {/* Audio Preview */}
        {previewUrl && (
          <audio controls className="w-full mt-2">
            <source src={previewUrl} type={file.type} />
            Your browser does not support the audio element.
          </audio>
        )}

        <p className="text-sm text-gray-600">
          File must be <code>.mp3</code> or <code>.wav</code>
        </p>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !file}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </div>

      {/* API Response Box */}
      <div className="z-10 mt-6 w-full max-w-md bg-white shadow-md rounded-xl p-4 min-h-[100px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : (
          <>
            {apiResponse?.matches?.length > 0 ? (
              apiResponse.matches.map((audio, index) => (
                <AudioPlayer key={index} base64Audio={audio} />
              ))
            ) : (
              <p className="text-sm text-gray-600">No matches found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
