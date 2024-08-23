import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';
dotenv.config();
const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_IPFS_PROJECT_ID + ':' + process.env.REACT_APP_IPFS_PROJECT_SECRET).toString('base64');
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
const FileUploadComponent: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    try {
      const addedFile = await ipfs.add(files[0]);
      const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`;
      setFileUrl(url);
      console.log('File uploaded:', url);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  }
  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {fileUrl && (
        <div>
          <p>File Uploaded Successfully. Access it here:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
        </div>
      )}
    </div>
  );
};
export default FileUploadComponent;