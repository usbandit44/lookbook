const generate = async (
    presetTypes: PresetTypesType,
  ): Promise<number[] | null> => {
    try {
      const avaliableSubtypes = Object.values(presetTypes).flat();
      const subtypesNotInCloset =
        await itemRepo.getSubtypesMissingFromCloset(avaliableSubtypes);
      if (subtypesNotInCloset.length > 0) {
        setMissingSubtypes(subtypesNotInCloset);
        return null;
      }}}