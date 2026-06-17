import ClothingSubtypeClassifier from "../modules/clothing-subtype-classifier";

export async function getClassification(
  imgUrl: string,
): Promise<[string, string]> {
  const classification = await ClothingSubtypeClassifier.classify(imgUrl);

  const [type, unformattedSubtype] = classification.label.split("_");
  const subtype = unformattedSubtype.replace(/([a-z])([A-Z])/g, "$1 $2");
  return [type, subtype];
}
