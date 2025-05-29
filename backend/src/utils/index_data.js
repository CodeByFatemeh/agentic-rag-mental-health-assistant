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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pinecone_1 = require("@pinecone-database/pinecone");
var openai_1 = require("@langchain/openai");
// import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
var fs_1 = require("fs");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
// Init Pinecone
var pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
// Choose embedding model: OpenAI or HuggingFace
var useOpenAI = true; // Set to false to use sentence-transformers
var embeddingModel = 
// useOpenAI ?
new openai_1.OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-ada-002',
});
//   : new HuggingFaceInferenceEmbeddings({
//       apiKey: process.env.HUGGINGFACE_API_KEY!,
//       model: 'sentence-transformers/all-MiniLM-L6-v2',
//     });
var EMBEDDING_DIMENSION = useOpenAI ? 1536 : 384;
function indexMentalHealthData() {
    return __awaiter(this, void 0, void 0, function () {
        var data, indexName_1, indexes, indexExists, index, _i, data_1, item, embedding, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    data = JSON.parse(fs_1.default.readFileSync('mental_health_data.json', 'utf-8'));
                    indexName_1 = 'mental-health-index';
                    return [4 /*yield*/, pinecone.listIndexes()];
                case 1:
                    indexes = _b.sent();
                    indexExists = (_a = indexes.indexes) === null || _a === void 0 ? void 0 : _a.some(function (index) { return index.name === indexName_1; });
                    if (!!indexExists) return [3 /*break*/, 3];
                    return [4 /*yield*/, pinecone.createIndex({
                            name: indexName_1,
                            dimension: EMBEDDING_DIMENSION,
                            metric: 'cosine',
                            spec: { serverless: { cloud: 'aws', region: process.env.PINECONE_ENVIRONMENT } },
                        })];
                case 2:
                    _b.sent();
                    console.log("Created Pinecone index: ".concat(indexName_1));
                    _b.label = 3;
                case 3:
                    index = pinecone.Index(indexName_1);
                    _i = 0, data_1 = data;
                    _b.label = 4;
                case 4:
                    if (!(_i < data_1.length)) return [3 /*break*/, 8];
                    item = data_1[_i];
                    if (!item.title || !item.content) {
                        console.warn("Skipping item with missing title or content: ".concat(JSON.stringify(item)));
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, embeddingModel.embedQuery(item.content)];
                case 5:
                    embedding = _b.sent();
                    return [4 /*yield*/, index.upsert([
                            {
                                id: item.title,
                                values: embedding,
                                metadata: {
                                    source: item.source || 'Unknown',
                                    category: item.category || 'general',
                                },
                            },
                        ])];
                case 6:
                    _b.sent();
                    console.log("Indexed: ".concat(item.title));
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    console.log('Data indexed successfully');
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _b.sent();
                    console.error('Error indexing data:', error_1);
                    throw error_1;
                case 10: return [2 /*return*/];
            }
        });
    });
}
indexMentalHealthData().catch(function (error) {
    console.error('Indexing failed:', error);
    process.exit(1);
});
