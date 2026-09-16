// detección de cookie de sesión
export function ensureSession(req, res, next) {
    if (req.signedCookies.jwt) next();
    else res.status(401).json({ message: "sesión expirada" });
}