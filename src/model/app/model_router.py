from fastapi import FastAPI

from schemas import ModelInferenceRequest, BERTopicInferenceResponse
from __init__ import model


app = FastAPI(prefix='/model')

@app.post('/fit-transform', response_model=BERTopicInferenceResponse)
async def fit_predict(request: ModelInferenceRequest) -> None:
    document_clusters =  model.fit_transform(request.Reviews)[0]

    response = BERTopicInferenceResponse(
        Topics={key: [word[0] for word in val]
                 for key, val in model.get_topics().items()},
        DocumentClusters=document_clusters,
        RepresentativeDocuments=model.get_representative_docs())
    return response