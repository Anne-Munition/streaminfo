import Cheer, { CheerDoc } from './cheer_model';

function create(payload: CheerPayload, createdAt?: string): CheerDoc {
  const doc = new Cheer({ payload });
  if (createdAt) doc.createdAt = createdAt;
  return doc;
}

async function save(doc: CheerDoc): Promise<CheerDoc> {
  return doc.save();
}
async function list(): Promise<CheerDoc[]> {
  return Cheer.find({});
}

export default {
  create,
  save,
  list,
};
