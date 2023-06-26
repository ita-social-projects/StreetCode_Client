import "./PartnerModal.styles.scss";
import "@features/AdminPage/AdminModal.styles.scss";

import CancelBtn from "@images/utils/Cancel_btn.svg";

import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import PreviewFileModal from "@features/AdminPage/NewStreetcode/MainBlock/PreviewFileModal/PreviewFileModal.component";
import useMobx from "@stores/root-store";

import { Button, Checkbox, Form, Input, Modal, Select, UploadFile } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";

import ImagesApi from "@/app/api/media/images.api";
import partnersApi from "@/app/api/partners/partners.api";
import FileUploader from "@/app/common/components/FileUploader/FileUploader.component";
import base64ToUrl from "@/app/common/utils/base64ToUrl.utility";
import PartnerLink from "@/features/AdminPage/PartnersPage/PartnerLink.component";
import Image from "@/models/media/image.model";
import Partner, {
  LogoType,
  PartnerCreateUpdate,
  PartnerSourceLinkCreateUpdate,
} from "@/models/partners/partners.model";
import { StreetcodeShort } from "@/models/streetcode/streetcode-types.model";

const PartnerModal: React.FC<{
  partnerItem?: Partner;
  open: boolean;
  isStreetcodeVisible?: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  afterSubmit?: (partner: Partner) => void;
}> = observer(
  ({
    partnerItem,
    open,
    setIsModalOpen,
    isStreetcodeVisible = true,
    afterSubmit,
  }) => {
    const [showSecondForm, setShowSecondForm] = useState(false);
    const [showSecondFormButton, setShowSecondFormButton] = useState(true);
    const [form] = Form.useForm();
    const { partnersStore, streetcodeShortStore } = useMobx();
    const [partnerLinksForm] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const selectedStreetcodes = useRef<StreetcodeShort[]>([]);
    const [partnerSourceLinks, setPartnersSourceLinks] = useState<
      PartnerSourceLinkCreateUpdate[]
    >([]);
    const imageId = useRef<number>(0);
    const handlePreview = (file: UploadFile) => {
      setFilePreview(file);
      setPreviewOpen(true);
    };
    const onStreetcodeSelect = (value: string) => {
      const index = streetcodeShortStore.streetcodes.findIndex(
        (c) => c.title === value
      );
      selectedStreetcodes.current.push(streetcodeShortStore.streetcodes[index]);
    };
    const onStreetcodeDeselect = (value: string) => {
      selectedStreetcodes.current = selectedStreetcodes.current.filter(
        (c) => c.title !== value
      );
    };
    useEffect(() => {
      if (isStreetcodeVisible) {
        streetcodeShortStore.fetchStreetcodesAll();
      }
    }, []);
    useEffect(() => {
      if (partnerItem && open) {
        imageId.current = partnerItem.logoId;
        form.setFieldsValue({
          title: partnerItem.title,
          isKeyPartner: partnerItem.isKeyPartner,
          url: partnerItem.targetUrl.href,
          urlTitle: partnerItem.targetUrl.title,
          description: partnerItem.description,
          partnersStreetcodes: partnerItem.streetcodes.map((s) => s.title),
          isVisibleEverywhere: partnerItem.isVisibleEverywhere,
          logo: [
            {
              name: "",
              thumbUrl: base64ToUrl(
                partnerItem.logo?.base64,
                partnerItem.logo?.mimeType
              ),
              uid: partnerItem.logoId.toString(),
              status: "done",
            },
          ],
        });
        selectedStreetcodes.current = partnerItem.streetcodes;
        setPartnersSourceLinks(
          partnerItem.partnerSourceLinks.map((l) => ({
            id: l.id,
            logoType: l.logoType,
            targetUrl: l.targetUrl.href,
            title: l.title,
          }))
        );
      } else {
        imageId.current = 0;
      }
    }, [partnerItem, open, form]);

    const closeAndCleanData = () => {
      form.resetFields();
      partnerLinksForm.resetFields();
      selectedStreetcodes.current = [];
      partnerSourceLinks.splice(0);
      setIsModalOpen(false);
      setShowSecondForm(false);
      setShowSecondFormButton(true);
    };

    const onSuccesfulSubmitLinks = (formValues: any) => {
      const url = formValues.url as string;
      const logotype = partnerLinksForm.getFieldValue("logotype");

      let newId = Math.min(...partnerSourceLinks.map((item) => item.id));
      if (newId < 0) {
        newId -= 1;
      } else {
        newId = -1;
      }
      setPartnersSourceLinks([
        ...partnerSourceLinks,
        {
          id: newId,
          logoType: Number(LogoType[logotype]),
          targetUrl: url,
          title: "title",
        },
      ]);
      partnerLinksForm.resetFields();
      setShowSecondForm(false);
      setShowSecondFormButton(true);
    };
    const handleShowSecondForm = () => {
      setShowSecondForm(true);
      setShowSecondFormButton(false);
    };
    const onSuccesfulSubmitPartner = async (formValues: any) => {
        if(showSecondForm && ( !partnerLinksForm.getFieldValue("logotype") || !partnerLinksForm.getFieldValue("url") ))
        {
            
        }
      partnerSourceLinks.forEach((el, index) => {
        if (el.id < 0) {
          partnerSourceLinks[index].id = 0;
        }
        partnerSourceLinks[index].title = "title";
      });
      const partner: PartnerCreateUpdate = {
        id: 0,
        isKeyPartner: formValues.isKeyPartner ?? false,
        logoId: imageId.current,
        partnerSourceLinks,
        streetcodes: selectedStreetcodes.current,
        targetUrl: formValues.url ?? "",
        title: formValues.title,
        description: formValues.description ?? "",
        urlTitle: formValues.urlTitle ?? "",
        isVisibleEverywhere: formValues.isVisibleEverywhere ?? false,
      };
      if (partnerItem) {
        partner.id = partnerItem.id;
        Promise.all([
          partnersApi
            .update(partner)
            .then((p) => {
              if (afterSubmit) {
                if (p) {
                  afterSubmit({ ...p });
                }
              }
              return p;
            })
            .then((p) => {
              ImagesApi.getById(p.logoId).then((img) => {
                partnersStore.setItem({ ...p, logo: img });
              });
            })
            .catch((e) => {}),
        ]);
      } else {
        Promise.all([
          partnersStore
            .createPartner(partner)
            .then((p) => {
              if (afterSubmit && p) {
                afterSubmit(p);
              }
            })
            .catch((e) => {}),
        ]);
      }
      closeAndCleanData();
    };

    const selectSocialMediaOptions = [
      {
        value: "twitter",
        label: "Twitter",
      },
      {
        value: "instagram",
        label: "Instagram",
      },
      {
        value: "facebook",
        label: "Facebook",
      },
      {
        value: "youtube",
        label: "Youtube",
      },
    ];
    return (
      <Modal
        open={open}
        onCancel={closeAndCleanData}
        className="modalContainer"
        footer={null}
        closeIcon={<CancelBtn />}
      >
        <div className="modalContainer-content">
          <Form
            form={form}
            layout="vertical"
            onFinish={onSuccesfulSubmitPartner}
          >
            <div className="center">
              <h2>{partnerItem ? "Редагувати" : "Додати"} партнера</h2>
            </div>
            <div className="checkbox-container">
              <Form.Item
                className="line-form-item"
                name="isKeyPartner"
                valuePropName="checked"
                label="Ключовий партнер: "
              >
                <Checkbox />
              </Form.Item>

              <Form.Item
                className="line-form-item"
                name="isVisibleEverywhere"
                valuePropName="checked"
                label="Видимий для всіх: "
              >
                <Checkbox />
              </Form.Item>
            </div>

            <Form.Item
              name="title"
              label="Назва: "
              rules={[{ required: true, message: "Введіть назву" }]}
            >
              <Input maxLength={100} showCount />
            </Form.Item>

            <Form.Item
              name="url"
              label="Посилання: "
              rules={[
                { required: true, message: "Введіть Посилання" },
                {
                  pattern:
                    /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?([/?].*)?$/i,
                  message: "Введіть правильне посилання",
                },
              ]}
            >
              <Input maxLength={200} showCount />
            </Form.Item>

            <Form.Item name="urlTitle" label="Назва посилання: ">
              <Input maxLength={100} showCount />
            </Form.Item>

            <Form.Item name="description" label="Опис: ">
              <TextArea showCount maxLength={450} />
            </Form.Item>

            <Form.Item
              name="logo"
              label="Лого"
              valuePropName="fileList"
              getValueFromEvent={(e: any) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
              rules={[{ required: true, message: "Завантажте лого" }]}
            >
              <FileUploader
                multiple={false}
                accept=".jpeg,.png,.jpg"
                listType="picture-card"
                maxCount={1}
                onPreview={handlePreview}
                uploadTo="image"
                onSuccessUpload={(image: Image) => {
                  imageId.current = image.id;
                }}
                defaultFileList={
                  partnerItem
                    ? [
                        {
                          name: "",
                          thumbUrl: base64ToUrl(
                            partnerItem.logo?.base64,
                            partnerItem.logo?.mimeType
                          ),
                          uid: partnerItem.logoId.toString(),
                          status: "done",
                        },
                      ]
                    : []
                }
              >
                <p>Виберіть чи перетягніть файл</p>
              </FileUploader>
            </Form.Item>
            <PreviewFileModal
              opened={previewOpen}
              setOpened={setPreviewOpen}
              file={filePreview}
            />

            {isStreetcodeVisible ? (
              <Form.Item name="partnersStreetcodes" label="Стріткоди: ">
                <Select
                  mode="multiple"
                  onSelect={onStreetcodeSelect}
                  onDeselect={onStreetcodeDeselect}
                >
                  {streetcodeShortStore.streetcodes.map((s) => (
                    <Select.Option key={`${s.id}`} value={s.title}>
                      {s.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              ""
            )}
          </Form>
        </div>
        <div className="partner-source-list">
          {partnerSourceLinks.map((link) => (
            <div
              key={`${link.id}${link.logoType}`}
              className="partner-source-list-item"
            >
              <PartnerLink link={link} />
              <p>{link.targetUrl}</p>
              <DeleteOutlined
                onClick={() =>
                  setPartnersSourceLinks(
                    partnerSourceLinks.filter((l) => l.id !== link.id)
                  )
                }
              />
            </div>
          ))}
        </div>
        {showSecondFormButton && (
          <Button onClick={handleShowSecondForm} className="custom-button">
            Додати соціальну мережу
          </Button>
        )}
        <Form
          layout="vertical"
          form={partnerLinksForm}
          onFinish={onSuccesfulSubmitLinks}
        >
          {showSecondForm && (
            <div className="link-container">
              <FormItem
                name="logotype"
                label="Соціальна мережа"
                rules={[{ required: true, message: "Виберіть соц. мережу" }]}
              >
                <Select options={selectSocialMediaOptions} />
              </FormItem>
              <Form.Item
                label="Посилання"
                className="url-input"
                name="url"
                rules={[
                  { required: true, message: "Введіть Посилання" },
                  {
                    pattern:
                      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?([/?].*)?$/i,
                    message: "Введіть правильне посилання",
                  },
                  {
                    validator: (_, value) => {
                      const logotype =
                        partnerLinksForm.getFieldValue("logotype");
                      if (
                        !value ||
                        !logotype ||
                        value.toLowerCase().includes(logotype)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Посилання не співпадає з вибраним текстом"
                      );
                    },
                  },
                ]}
              >
                <Input min={1} max={255} showCount />
              </Form.Item>

              <Form.Item label=" ">
                <Button htmlType="submit">
                  <PlusOutlined />
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>

        <div className="center">
          <Button
            className="streetcode-custom-button"
            onClick={() => {
              if (showSecondForm) {
                partnerLinksForm.submit();
              }
              form.submit();
            }}
          >
            Зберегти
          </Button>
        </div>
      </Modal>
    );
  }
);
export default PartnerModal;
