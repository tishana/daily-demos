function getChromeVersion() {
  let major = 0,
    minor = 0,
    build = 0,
    patch = 0,
    opera = false;
  if (typeof window !== "undefined") {
    const userAgent = window.navigator.userAgent,
      match = userAgent.match(/Chrome\/(\d+).(\d+).(\d+).(\d+)/);
    if (match) {
      try {
        major = parseInt(match[1]);
        minor = parseInt(match[2]);
        build = parseInt(match[3]);
        patch = parseInt(match[4]);
        opera = userAgent.indexOf("OPR/") > -1;
      } catch (e) {}
    }
  }
  return { major, minor, build, patch, opera };
}

/**
 * Screen sharing only really works on Chrome. Trying to invoke
 * `startScreenShare()` on other browsers can result in unexpected behavior.
 *
 * This isn't ideal. In a future release, daily-js will more gracefully
 * handle browser support so you don't have to hard-code checks like this.
 */
export function browserSupportsScreenShare() {
  if (
    navigator.userAgent.match(/Chrome\//) &&
    !navigator.userAgent.match(/Edge\//)
  ) {
    let version = getChromeVersion();
    return version.major && version.major > 0 && version.major >= 56;
  }
  return false;
}
