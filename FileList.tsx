import React, { useEffect, useState } from "react";
import axios from "axios";

interface File {
  id: string;
  name: string;
  url: string;
}

const FileViewer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/files`);
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to fetch files", error);
      }
    };

    fetchFiles();
  }, []);

  const deleteFile = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/files/${id}`);
      setFiles(currentFiles => currentFiles.filter(file => file.id !== id));
    } catch (error) {
      console.error("Failed to delete file", error);
    }
  };

  return (
    <div>
      <h2>Stored Files</h2>
      {files.length > 0 ? (
        <ul>
          {files.map(file => (
            <li key={file.id}>
              {file.name}
              <a href={file.url} target="_blank" rel="noopener noreferrer"> Download </a>
              <button onClick={() => deleteFile(file.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files stored.</p>
      )}
    </div>
  );
};

export default FileViewer;