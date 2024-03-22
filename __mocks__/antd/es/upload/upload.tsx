import React, { useState } from "react";

interface UploadMockProps {
  onChange: (fileList: File | null) => void;
}

const UploadMock: React.FC<UploadMockProps> = ({ onChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
    if(!selectedFile===null) onChange(selectedFile);
  };

  return (
    <div>
      <input type="file" data-testid="file-input" onChange={handleFileChange} />
    </div>
  );
};

export default UploadMock;
