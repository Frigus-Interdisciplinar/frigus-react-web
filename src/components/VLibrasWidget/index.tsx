import { useEffect } from "react";
import { useAccessibility } from "@/contexts/useAccessibility";

const SCRIPT_ID = "frigus-vlibras-widget-script";

export default function VLibrasWidget() {
  const { vlibrasEnabled } = useAccessibility();

  useEffect(() => {
    if (!vlibrasEnabled || document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.dataset.frigusWidget = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.querySelectorAll(".vw-plugin-wrapper, [vw]").forEach((widget) => widget.remove());
    };
  }, [vlibrasEnabled]);

  return null;
}
