import { Request, Response } from "express";
import { loginUser } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};


export const getMe = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

