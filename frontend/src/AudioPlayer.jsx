// components/AudioPlayer.js
import React from "react";

const AudioPlayer = ({ base64Audio }) => {
  // Construct audio URL from base64 string
  const audioSrc = `data:audio/wav;base64,${base64Audio}`;

  return (
    <div className="my-2">
      <audio controls className="w-full">
        <source src={audioSrc} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
