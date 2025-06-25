import React, { useState } from 'react';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://44.223.11.40:8001/upload-call', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log('Success:', data))
      .catch((err) => console.error('Error:', err));
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;