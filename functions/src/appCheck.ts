import { initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';
import express from 'express';

const app = initializeApp();

export const appCheckVerification = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    res.status(401);
    return next('Unauthorized');
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken);
    return next();
  } catch (err) {
    res.status(401);
    return next('Unauthorized');
  }
};

// Optional: Add replay protection for sensitive endpoints
export const appCheckVerificationWithReplay = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    res.status(401);
    return next('Unauthorized');
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken, { consume: true });
    
    if (appCheckClaims.alreadyConsumed) {
      res.status(401);
      return next('Token already consumed');
    }
    
    return next();
  } catch (err) {
    res.status(401);
    return next('Unauthorized');
  }
};