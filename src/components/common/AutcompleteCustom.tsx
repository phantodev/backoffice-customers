'use client'

import { ICustomer } from '@/interfaces/customers'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'

interface IAutocompleteCustomProps {
  isLoading: boolean
  data: ICustomer[] | undefined
  handleAutocompleteCustom: (value: React.Key | null) => void
}

export default function AutocompleteCustom(props: IAutocompleteCustomProps) {
  return (
    <Autocomplete
      label="Quem indicou este cliente?"
      placeholder="Busque pelo nome..."
      className="w-full"
      defaultItems={!props.isLoading && props.data ? props.data : []}
      isLoading={props.isLoading}
      isDisabled={props.isLoading}
      onSelectionChange={(value: React.Key | null) =>
        props.handleAutocompleteCustom(value)
      }
    >
      {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  )
}
