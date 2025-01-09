import './PdfPreviewPage.styles.scss';

import { pdf } from '@react-pdf/renderer';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import Loader from '@components/Loader/Loader.component';
import StreetcodeDocument from '@streetcode/PdfPreviewPage/PdfDocument/StreetcodeDocument.component';
import blobStream from 'blob-stream';

import { Button } from 'antd';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PDFPreviewPage = () => {
    const location = useLocation();
    const { streetcode, image } = location.state || {};
    const pdfUrlRef = useRef<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [numPages2, setNumPages] = useState<number>();
    const isLaptop = useMediaQuery({ query: '(min-width: 1025px)' });

    const [scale, setScale] = useState(1);

    const generatePdf = async () => {
        if (streetcode && image) {
            const buffer = await pdf(<StreetcodeDocument streetcode={streetcode} image={image} />).toBuffer();
            const stream = buffer.pipe(blobStream());

            return new Promise<string>((resolve) => {
                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                });
            });
        }
        return null;
    };

    const downloadPdf = () => {
        if (pdfUrlRef.current) {
            const link = document.createElement('a');
            link.href = pdfUrlRef.current;
            link.download = `${streetcode.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const calculateScale = () => {
        const containerWidth = window.innerWidth * 0.8;
        const containerHeight = window.innerHeight;
        const pdfWidth = 600;
        const pdfHeight = 850;
        const widthScale = containerWidth / pdfWidth;
        const heightScale = containerHeight / pdfHeight;
        return Math.min(widthScale, heightScale);
    };

    useEffect(() => {
        (async () => {
            const url = await generatePdf();
            if (url) {
                pdfUrlRef.current = url;
            }
            setIsLoading(false);
            setScale(calculateScale());
        })();

        return () => {
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
            }
        };
    }, [streetcode, image]);

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div className="pdfPreviewWrapper">
                <div className="pdfPreviewContainer">
                    {pdfUrlRef.current ? (
                        isLaptop ? (
                            <div className="iframeWrapper">
                                <iframe
                                    src={pdfUrlRef.current}
                                    title="PDF Preview"
                                />
                                <div className="buttonContainer">
                                    <Button
                                        type="primary"
                                        className="redButton"
                                        disabled
                                    >
                                        Додати в кабінет
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Document
                                    file={pdfUrlRef.current}
                                    onLoadSuccess={({numPages}) => setNumPages(numPages)}
                                >
                                    {Array.from(new Array(numPages2), (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            // width={600}
                                            scale={scale}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    ))}
                                </Document>
                                <div className="buttonContainer">
                                    <Button
                                        type="primary"
                                        className="redButton"
                                        onClick={downloadPdf}
                                    >
                                        Завантажити PDF
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="redButton"
                                        disabled
                                    >
                                        Додати в кабінет
                                    </Button>
                                </div>
                            </div>
                        )
                    ) : (
                        <p>Не вдалося згенерувати PDF</p>
                    )}
                </div>
            </div>
        )
    );
};

export default PDFPreviewPage;
