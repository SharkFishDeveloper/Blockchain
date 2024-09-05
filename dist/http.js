"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHttp = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const DB_1 = __importDefault(require("./util/DB"));
const bip39_1 = __importDefault(require("bip39"));
const signupZodObject = zod_1.z.object({
    password: zod_1.z.string().min(8, "Password is too small").max(20, "Password is too large")
});
function initHttp(app) {
    app.use(express_1.default.json());
    app.post("/signup", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const mnemonic = bip39_1.default === null || bip39_1.default === void 0 ? void 0 : bip39_1.default.generateMnemonic();
            console.log(mnemonic);
            const signupParse = signupZodObject.safeParse(req.body);
            if (signupParse.error) {
                return res.status(400).json({ message: signupParse.error.errors[0].message });
            }
            const finduser = yield DB_1.default.user.findUnique({
                where: {
                    password: req.body.password
                }
            });
            if (finduser) {
                return res.json({ message: "User already exists", status: 400 });
            }
            else if (!finduser) {
                yield DB_1.default.user.create({
                    data: {
                        password: req.body.password
                    }
                });
                return res.json({ message: "User created successfully", status: 200 });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({ message: error.errors[0].message });
            }
        }
    }));
    app.get("/", (req, res) => {
        return res.json({ message: "Over here" });
    });
}
exports.initHttp = initHttp;
