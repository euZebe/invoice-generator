import React, { useEffect, useState } from "react";
import clients from "./assets/data/clients.json";
import SelectInput from "ink-select-input";
import { Box, Text } from "ink";
import NumberInput from "./component/number-input";
import Mustache from "mustache";
import { generateInvoicePdf } from "./invoice/generate-invoice";
import { CompletedFormValues, FormValues } from "./client.model";
import TextInput from "ink-text-input";
import { format, subDays } from "date-fns";
import Header from "./component/header";

const booleanValues = [
  { label: "yes", value: "yes" },
  { label: "no", value: "no" },
];
const clientsAsMap = clients.map((client) => ({
  label: client.name,
  value: client.name,
}));

function isFormCompleted(formValues: any): formValues is CompletedFormValues {
  return (
    !!formValues.price &&
    !!formValues.workedDays &&
    !!formValues.client &&
    !!formValues.filePath &&
    !!formValues.fileName
  );
}

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});

  const update: typeof setFormValues = (value) => {
    setFormValues({ ...formValues, ...value });
    setCurrentIndex((index) => index + 1);
  };

  const [outputFilePath, setOutputFilePath] = useState<string>();
  useEffect(() => {
    if (isFormCompleted(formValues)) {
      generateInvoicePdf(formValues).then((path) => {
        setTimeout(() => setOutputFilePath(path), 1000);
      });
    }
  }, [formValues]);

  return (
    <Box flexDirection="column">
      <Header />
      <Box marginRight={1} flexDirection="row">
        <Text>Client: </Text>
        {currentIndex === 0 ? (
          <SelectInput
            items={clientsAsMap}
            onSelect={(selected) => {
              const client = clients.find(
                (client) => client.name === selected.value
              );
              update({
                client,
                fileName: Mustache.render(
                  `{{dateMonth}}-facture-{{client.name}}`,
                  {
                    dateMonth: format(subDays(new Date(), 3), "yyyy-MM"),
                    client,
                  }
                ),
              });
            }}
          />
        ) : (
          <Text>{formValues.client?.name}</Text>
        )}
      </Box>
      {currentIndex === 1 ? (
        <NumberInput
          label="Days worked"
          onValidNumberSubmitted={(value) =>
            update({ workedDays: Number(value) })
          }
        />
      ) : (
        <Text>Days worked: {formValues.workedDays}</Text>
      )}
      {currentIndex === 2 ? (
        <NumberInput
          label="Price"
          initialValue="500"
          onValidNumberSubmitted={(value) => update({ price: Number(value) })}
        />
      ) : (
        <Text>Price: {formValues.price}</Text>
      )}
      <Box marginRight={1} flexDirection="row">
        <Text>FileName: </Text>
        {currentIndex === 3 ? (
          <TextInput
            value={formValues.fileName || ""}
            onChange={(fileName) =>
              setFormValues((formValues) => ({ ...formValues, fileName }))
            }
            onSubmit={(fileName) => update({ fileName })}
          />
        ) : (
          <Text>{formValues.fileName}</Text>
        )}
      </Box>

      {currentIndex === 4 ? (
        <Box marginRight={1} flexDirection="row">
          <Text>Save on nextcloud ? </Text>
          <SelectInput
            items={booleanValues}
            onSelect={(saveInNexcloud) =>
              update({
                filePath:
                  saveInNexcloud.value === "yes"
                    ? process.env["HOME"] + "/Nextcloud/Entreprise/Facturation/"
                    : process.cwd() + "/output/",
              })
            }
          />
        </Box>
      ) : null}
      {outputFilePath ? (
        <Box>
          <Text>File stored to </Text>
          <Text color={"blueBright"}>file://{outputFilePath}</Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default App;
