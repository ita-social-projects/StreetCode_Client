import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import relatedTermApi from "@api/streetcode/text-content/related-terms.api";
import useMobx, { useModalContext } from "@app/stores/root-store";

import { message } from "antd";
import FormItem from "antd/es/form/FormItem";

import Editor from "@/app/common/components/Editor/QEditor.component";
import { useAsync } from "@/app/common/hooks/stateful/useAsync.hook";
import { Term, Text } from "@/models/streetcode/text-contents.model";

interface Props {
  character_limit?: number;
  inputInfo: Partial<Text> | undefined;
  setInputInfo: React.Dispatch<React.SetStateAction<Partial<Text> | undefined>>;
  onChange: (field: string, value: any) => void;
  text: string | undefined;
}

const TextEditor = ({
  character_limit,
  inputInfo,
  setInputInfo,
  onChange,
  text,
}: Props) => {
  const { relatedTermStore, termsStore } = useMobx();
  const {
    modalStore: { setModal },
  } = useModalContext();
  const { fetchTerms, getTermArray } = termsStore;
  const { createRelatedTerm } = relatedTermStore;
  const [term, setTerm] = useState<Partial<Term>>();
  const [selected, setSelected] = useState("");
  const editorRef = useRef<ReactQuill | null>(null);
  const MAX_CHARS = character_limit || 25000;
  const [isTitleEmpty, setIsTitleEmpty] = useState(true);

  const invokeMessage = (context: string, success: boolean) => {
    const config = {
      content: context,
      style: { marginTop: "190vh" },
    };
    if (success) {
      message.success(config);
    } else {
      message.error(config);
    }
  };

  useEffect(() => {
    setIsTitleEmpty(!inputInfo?.title || inputInfo.title === "");
  }, [inputInfo?.title]);

  const handleAddRelatedWord = async () => {
    if (term !== null && selected !== null) {
      const result = await createRelatedTerm(selected, term?.id as number);
      const resultMessage = result
        ? "Слово було успішно прив`язано до терміну"
        : "Слово вже було пов`язано";
      invokeMessage(resultMessage, result);
    }
  };

  const handleDeleteRelatedWord = async () => {
    const errorMessage = "Слово не було пов`язано";
    try {
      if (selected == null || selected === undefined) {
        invokeMessage("Будь ласка виділіть слово для видалення", false);
        return;
      }
      await relatedTermApi
        .delete(selected)
        .then((response) => {
          const resultMessage =
            response != null
              ? "Слово було успішно відв`язано від терміну"
              : errorMessage;
          invokeMessage(resultMessage, response != null);
        })
        .catch(() => invokeMessage(errorMessage, false));
    } catch {
      invokeMessage(errorMessage, false);
    }
  };

  const handleAddSimple = async () => {
    const newTerm: Term = {
      id: 0,
      title: term?.title as string,
      description: term?.description,
    };
    const result = await termsStore.createTerm(newTerm);
    const resultMessage =
      result != null
        ? "Термін успішно додано"
        : "Термін не було додано, спробуйте ще.";
    invokeMessage(resultMessage, result != null);
  };

  useAsync(fetchTerms, []);

  return (
    <FormItem
        name="textContent"
        label="Основний текст"
    >
        <div className={isTitleEmpty ? "disabled" : ""}>
        <Editor
        qRef={editorRef}
        value={text ?? ""}
        onChange={(editor) => {
          setInputInfo((prevState) => ({ ...prevState, textContent: editor }));
          onChange("textContent", editor);
        }}
        maxChars={MAX_CHARS}
        selectionChange={(selectedText: string) => {
          setSelected(selectedText);
        }}
        readOnly={isTitleEmpty}
      />
        </div>
    </FormItem>
  );
};

export default observer(TextEditor);
