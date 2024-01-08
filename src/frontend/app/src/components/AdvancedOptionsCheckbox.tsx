import { FormLabel, FormControl, Checkbox, Flex } from "@chakra-ui/react";
import { useId, useState } from "react";
import { AdvancedOptionsList } from "./AdvancedOptionsList";

interface AdvancedOptionsCheckboxProps {
  setHasError: (hasError: boolean) => void;
  setStars: (stars: number) => void;
  setReviews: (reviews: number) => void;
  reviews: number;
  stars: number;
}
export const AdvancedOptionsCheckbox = ({
  setHasError,
  setStars,
  setReviews,
  reviews,
  stars,
}: AdvancedOptionsCheckboxProps) => {
  const checkboxId = useId();

  const [hideAdvancedOptions, setHideAdvancedOptions] = useState<boolean>(true);
  return (
    <FormControl
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"10px"}
      marginTop={"10px"}
    >
      <Flex alignItems={"center"}>
        <FormLabel marginBottom={0} htmlFor={checkboxId}>
          Show advanced options
        </FormLabel>
        <Checkbox
          onChange={() => setHideAdvancedOptions(!hideAdvancedOptions)}
          id={checkboxId}
        />
      </Flex>
      {hideAdvancedOptions ? null : (
        <AdvancedOptionsList
          stars={stars}
          reviews={reviews}
          setStars={setStars}
          setReviews={setReviews}
          setHasError={setHasError}
        />
      )}
    </FormControl>
  );
};
