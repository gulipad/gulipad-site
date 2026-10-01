import Home from "@/components/Home";
import { getWritings } from "@/lib/writings";

export default function Page() {
  return <Home writings={getWritings()} />;
}
