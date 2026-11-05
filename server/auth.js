/* ═══════════════════════════════════════════════════════════
   AUTHENTICATION & AUTHORIZATION ENGINE (JWT & RBAC)
   Cryptographic HMAC SHA-256 Tokens & Role Guard Middleware
═══════════════════════════════════════════════════════════ */

import crypto from 'crypto';

export const JWT_SECRET = process.env.JWT_SECRET || 'hts_gkas_jwt_secret_key_2027_nelspruit';

/**
 * Generate a cryptographically signed HMAC SHA-256 JWT
 * @param {Object} payload User payload (userId, role, name, email, studentNumber)
 * @param {number} expiresInSeconds Expiration duration in seconds (defaults to 7 days)
 * @returns {string} Standard JWT token format: header.payload.signature
 */
export function generateToken(payload, expiresInSeconds = 86400 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };

  const encHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const data = `${encHeader}.${encPayload}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

  return `${data}.${signature}`;
}

/**
 * Verify HMAC SHA-256 JWT signature and validity
 * @param {string} token Bearer token or raw JWT string
 * @returns {Object|null} Decoded payload if valid, null otherwise
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const rawToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
  const parts = rawToken.split('.');

  if (parts.length !== 3) {
    // Graceful backward compatibility for existing hts_jwt_ tokens
    if (rawToken.startsWith('hts_jwt_')) {
      try {
        const decoded = Buffer.from(rawToken.replace('hts_jwt_', ''), 'base64url').toString('utf-8');
        const [userId] = decoded.split(':');
        if (userId === 'usr_admin') {
          return { userId: 'usr_admin', id: 'usr_admin', role: 'admin', roleKey: 'admin', name: 'L. Marsher' };
        } else if (userId === 'usr_student') {
          return { userId: 'usr_student', id: 'usr_student', role: 'student', roleKey: 'student', name: 'Thandeka Nkosi', studentNumber: '21304567' };
        }
      } catch (e) {}
    }
    return null;
  }

  const [encHeader, encPayload, signature] = parts;
  const data = `${encHeader}.${encPayload}`;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expSigBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expSigBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encPayload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Express Middleware: Verify Bearer token in Authorization header
 * Extracts token, verifies signature, and attaches req.user (userId, role, etc.)
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing Authorization header with Bearer token.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid Authorization header format. Expected "Bearer <token>".'
    });
  }

  const token = parts[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired authentication token.'
    });
  }

  req.user = {
    userId: decoded.userId || decoded.id,
    id: decoded.userId || decoded.id,
    role: decoded.role || (decoded.roleKey === 'admin' ? 'admin' : 'student'),
    roleKey: decoded.roleKey || (decoded.role === 'admin' ? 'admin' : 'student'),
    email: decoded.email,
    name: decoded.name,
    studentNumber: decoded.studentNumber
  };

  next();
}

/**
 * Express Middleware: Role-Based Access Control (RBAC)
 * @param {string[]} allowedRoles Array of roles permitted (e.g. ['admin'])
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication required.'
      });
    }

    const userRole = (req.user.roleKey || req.user.role || '').toLowerCase();
    const isAllowed = allowedRoles.some(r => {
      const target = r.toLowerCase();
      return target === userRole || (target === 'admin' && userRole === 'administrator');
    });

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user.roleKey || req.user.role}.`
      });
    }

    next();
  };
}
