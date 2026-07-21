import { permanentRedirect } from "next/navigation";

export default function LegacyLocalizedSheepRoute() {
  permanentRedirect("/sheep");
}