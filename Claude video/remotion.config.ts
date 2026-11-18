import { Config } from "@remotion/cli/config";
import fs from "fs";

// Remotion kendi Chrome'unu indiremezse (kısıtlı ağ), makinedeki hazır headless shell'i kullan.
const yerelChrome = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(yerelChrome)) {
  Config.setBrowserExecutable(yerelChrome);
}

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(120000);
