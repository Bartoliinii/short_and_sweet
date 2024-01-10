import { ChangeEvent, useId } from "react";
import { FormControl, Input, FormLabel } from "@chakra-ui/react";

interface UrlInputProps {
  setUrl: (url: string) => void;
  url: string;
}

const ReviewForm = ({  setUrl, url}: UrlInputProps) => {


  const urlFieldId = useId();

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };


  return (
    <FormControl
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"10px"}
    >
      <FormLabel htmlFor={urlFieldId}>Enter app URL:</FormLabel>
      <Input
        onChange={(e) => handleUrlChange(e)}
        width={"300px"}
        id={urlFieldId}
        placeholder="Paste app url..."
      />
    </FormControl>
  );
};

export default ReviewForm;
