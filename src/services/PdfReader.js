import React, { useState } from "react";
import { Upload, Button, Card, Typography, Table } from "antd";
import { UploadOutlined, FilePdfOutlined } from "@ant-design/icons";
import { readPdfMetaAndText } from "../utils/pdfReader";

const { Title, Paragraph } = Typography;

export default function PdfReaderAntd() {
  const [info, setInfo] = useState(null);

  const handleUpload = async ({ file }) => {
    if (file && file.type === "application/pdf") {
      const result = await readPdfMetaAndText(file);
      setInfo(result);
    }
  };

  const columns = [
    { title: "Property", dataIndex: "key", key: "key" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const data =
    info?.metadata &&
    Object.entries(info.metadata).map(([key, value]) => ({
      key,
      value: value || "-",
    }));

  return (
    <Card style={{ maxWidth: 800, margin: "20px auto", borderRadius: 12 }}>
      <Title level={3}>
        <FilePdfOutlined /> Read PDF & Headers
      </Title>

      <Upload
        accept="application/pdf"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          handleUpload({ file });
          setTimeout(() => onSuccess("ok"), 1000);
        }}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Upload PDF
        </Button>
      </Upload>

      {info && (
        <>
          <Title level={4} style={{ marginTop: 20 }}>
            Metadata
          </Title>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            size="small"
          />

          <Title level={4} style={{ marginTop: 20 }}>
            First Page Text
          </Title>
          <Paragraph
            style={{
              background: "#f9f9f9",
              padding: "12px",
              borderRadius: 8,
            }}
          >
            {info.text}
          </Paragraph>
        </>
      )}
    </Card>
  );
}
