import { hash, verify } from "argon2";
// import { activeGames } from "../db/services/game.js"; // Assuming this import is correct
// import { io } from "../server.js";
import type { Request, Response } from "express";
import xss from "xss";
import UserService from "../db/services/user.js";
import { asyncHandler } from "../db/helper.js";

export const getCurrentSession = asyncHandler(async (req: Request, res: Response) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(204).end();
    }
});

export const logoutSession = asyncHandler(async (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.status(204).end();
    });
});

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    if (req.session.user?.id) {
        res.status(403).end();
        return;
    }

    const name = xss(req.body.name);
    const email = xss(req.body.email);
    const password = await hash(req.body.password);

    const pattern = /^[A-Za-z0-9]+$/;

    if (!pattern.test(name)) throw new Error("Invalid Username Characters");

    const duplicateUsers = await UserService.findByNameEmail({ name, email });
    if (duplicateUsers && duplicateUsers.length) {
        const dupl = duplicateUsers[0].name === name ? "Username" : "Email";
        throw new Error(`${dupl} is already in use.`);
    }

    const newUser = await UserService.create({ name, email }, password);

    if (!newUser) {
        throw new Error("Failed to create user");
    }

    // const publicUser = {
    //     id: newUser.id,
    //     name: newUser.name
    // };
    // if (req.session.user?.id && typeof req.session.user.id === "string") {
    //     const game = activeGames.find(
    //         (g) =>
    //             g.white?.id === req.session.user.id ||
    //             g.black?.id === req.session.user.id ||
    //             g.observers?.find((o) => o.id === req.session.user.id)
    //     );
    //     if (game) {
    //         if (game.host?.id === req.session.user.id) {
    //             game.host = publicUser;
    //         }
    //         if (game.white && game.white?.id === req.session.user.id) {
    //             game.white = publicUser;
    //         } else if (game.black && game.black?.id === req.session.user.id) {
    //             game.black = publicUser;
    //         } else {
    //             const observer = game.observers?.find((o) => o.id === req.session.user.id);
    //             if (observer) {
    //                 observer.id = publicUser.id;
    //                 observer.name = publicUser.name;
    //             }
    //         }
    //         io.to(game.code as string).emit("receivedLatestGame", game);
    //     }
    // }

    req.session.user = newUser;
    req.session.save(() => {
        res.status(201).json(req.session.user);
    });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    if (req.session.user?.id) {
        res.status(403).end();
        return;
    }

    const nameOrEmail = xss(req.body.name);
    const password = req.body.password;

    const users = await UserService.findByNameEmail(
        { name: nameOrEmail, email: nameOrEmail },
        true
    );
    if (!users || !users.length) {
        throw new Error("Invalid username/email.");
    }

    const validPassword = await verify(users[0].password as string, password);
    if (!validPassword) {
        throw new Error("Invalid password.");
    }

    // const publicUser = {
    //     id: users[0].id,
    //     name: users[0].name
    // };

    // if (req.session.user?.id && typeof req.session.user.id === "string") {
    //     const game = activeGames.find(
    //         (g) =>
    //             g.white?.id === req.session.user.id ||
    //             g.black?.id === req.session.user.id ||
    //             g.observers?.find((o) => o.id === req.session.user.id)
    //     );
    //     if (game) {
    //         if (game.host?.id === req.session.user.id) {
    //             game.host = publicUser;
    //         }
    //         if (game.white && game.white?.id === req.session.user.id) {
    //             game.white = publicUser;
    //         } else if (game.black && game.black?.id === req.session.user.id) {
    //             game.black = publicUser;
    //         } else {
    //             const observer = game.observers?.find((o) => o.id === req.session.user.id);
    //             if (observer) {
    //                 observer.id = publicUser.id;
    //                 observer.name = publicUser.name;
    //             }
    //         }
    //         io.to(game.code as string).emit("receivedLatestGame", game);
    //     }
    // }

    req.session.user = {
        id: users[0].id.toString(),
        name: users[0].name,
        email: users[0].email,
        wins: users[0].wins,
        losses: users[0].losses,
        draws: users[0].draws
    };
    req.session.save(() => {
        res.status(200).json(req.session.user);
    });
});

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (req && res) {
            console.log("yes");
        }
        res.status(200).send("hello");
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
    // try {
    //     if (!req.session.user?.id || typeof req.session.user.id === "string") {
    //         res.status(403).end();
    //         return;
    //     }

    //     if (!req.body.name && !req.body.email && !req.body.password) {
    //         res.status(400).end();
    //         return;
    //     }

    //     const name = xss(req.body.name || req.session.user.name);
    //     const pattern = /^[A-Za-z0-9]+$/;
    //     if (!pattern.test(name)) {
    //         res.status(400).end();
    //         return;
    //     }

    //     const email = xss(req.body.email || req.session.user.email);
    //     const compareEmail = email || name;

    //     const duplicateUsers = await UserModel.find({ $or: [{ name }, { email: compareEmail }] });
    //     if (
    //         duplicateUsers &&
    //         duplicateUsers.length &&
    //         duplicateUsers[0].id !== req.session.user.id
    //     ) {
    //         const dupl = duplicateUsers[0].name === name ? "Username" : "Email";
    //         res.status(409).json({ message: `${dupl} is already in use.` });
    //         return;
    //     }

    //     let password: string | undefined = undefined;
    //     if (req.body.password) {
    //         password = await hash(req.body.password);
    //     }

    //     duplicateUsers

    //     const updatedUser = await UserModel.update(req.session.user.id, { name, email, password });

    //     if (!updatedUser) {
    //         throw new Error("Failed to update user");
    //     }

    //     const publicUser = {
    //         id: updatedUser.id,
    //         name: updatedUser.name
    //     };

    //     const game = activeGames.find(
    //         (g) =>
    //             g.white?.id === req.session.user.id ||
    //             g.black?.id === req.session.user.id ||
    //             g.observers?.find((o) => o.id === req.session.user.id)
    //     );
    //     if (game) {
    //         if (game.host?.id === req.session.user.id) {
    //             game.host = publicUser;
    //         }
    //         if (game.white && game.white?.id === req.session.user.id) {
    //             game.white = publicUser;
    //         } else if (game.black && game.black?.id === req.session.user.id) {
    //             game.black = publicUser;
    //         } else {
    //             const observer = game.observers?.find((o) => o.id === req.session.user.id);
    //             if (observer) {
    //                 observer.id = publicUser.id;
    //                 observer.name = publicUser.name;
    //             }
    //         }
    //         io.to(game.code as string).emit("receivedLatestGame", game);
    //     }

    //     req.session.user = updatedUser;
    //     req.session.save(() => {
    //         res.status(200).json(req.session.user);
    //     });
    // } catch (err: unknown) {
    //     console.log(err);
    //     res.status(500).end();
    // }
};
