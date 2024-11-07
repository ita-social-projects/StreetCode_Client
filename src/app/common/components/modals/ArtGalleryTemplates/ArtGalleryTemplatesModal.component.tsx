import React, { useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import CancelBtn from "@assets/images/utils/Cancel_btn.svg";
import ModalBg from "@assets/images/utils/ModalBg.webp";
import { Modal } from "antd";
import "./ArtGalleryTemplatesModal.scss";
import template1 from "@assets/images/ArtImages/template1.jpg";
import template2 from "@assets/images/ArtImages/template2.jpg";
import template3 from "@assets/images/ArtImages/template3.png";
import template4 from "@assets/images/ArtImages/template4.png";
import template5 from "@assets/images/ArtImages/template5.png";
import template6 from "@assets/images/ArtImages/template6.png";
import template7 from "@assets/images/ArtImages/template7.png";
import template8 from "@assets/images/ArtImages/template8.png";
import template9 from "@assets/images/ArtImages/template9.png";
import template10 from "@assets/images/ArtImages/template10.png";
import template11 from "@assets/images/ArtImages/template11.png";
import template12 from "@assets/images/ArtImages/template12.png";
import template13 from "@assets/images/ArtImages/template13.png";
import template14 from "@assets/images/ArtImages/template14.png";

const templates = [
  { src: template1, LWidth: '280px', lWidth: '230px', BWidth: '210px', bWidth: '180px', MWidth: '150px', index: 0 },
  { src: template3, LWidth: '132px', lWidth: '112px', BWidth: '102px', bWidth: '90px', MWidth: '70px', index: 2 },
  { src: template4, LWidth: '280px', lWidth: '230px', BWidth: '210px', bWidth: '180px', MWidth: '150px', index: 3 },
  { src: template2, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 1 },
  { src: template5, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 4 },
  { src: template6, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 5 },
  { src: template8, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 7 },
  { src: template7, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 6 },
  { src: template9, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 8 },
  { src: template10, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 9 },
  { src: template11, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 10 },
  { src: template12, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 11 },
  { src: template13, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px',index: 12 },
  { src: template14, LWidth: '400px', lWidth: '350px', BWidth: '320px', bWidth: '265px', MWidth: '225px', index: 13 }
];

interface ArtGalleryTemplatesModalProps {
  isOpen: boolean;
  onClose: (selectedTemplateIndex: number) => void;
  onTemplateSelect: (template: number) => void;
}

const ArtGalleryTemplatesModal: React.FC<ArtGalleryTemplatesModalProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
}) => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleImageClick = useCallback(
    (templateIndex: number) => {
      setSelectedTemplateIndex(templateIndex);
      onTemplateSelect(templateIndex);
      onClose(templateIndex);
    },
    [onClose, onTemplateSelect]
  );

  const updateScreenSize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const getWidth = (template: any) => {
    if (screenWidth > 1003) return template.LWidth;
    if (screenWidth > 903) return template.lWidth;
    if (screenWidth > 838) return template.BWidth;
    if (screenWidth > 728) return template.bWidth;
    if (screenWidth > 648) return template.MWidth;
    return template.MWidth; 
  };

  return (
    <Modal
      open={isOpen}
      className="ArtGalleryModal"
      maskClosable
      centered
      footer={null}
      closeIcon={<CancelBtn />}
      onCancel={() => onClose(selectedTemplateIndex)}
    >
      <div
        className="ArtGalleryImgContainer"
        style={{ backgroundImage: `url(${ModalBg})` }}
      >
        <h1>Шаблони</h1>
      </div>
      <div className="ArtTemplatesReadMoreContentContainer">
        {templates.map((template) => (
          <img
            key={template.index}
            src={template.src}
            className="template-image"
            style={{ width: getWidth(template), objectFit: 'contain' }}
            onClick={() => handleImageClick(template.index)}
          />
        ))}
      </div>
    </Modal>
  );
};

export default observer(ArtGalleryTemplatesModal);

