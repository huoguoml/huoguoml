from fastapi import FastAPI

# app = FastAPI(docs_url=None, redoc_url=None)
app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

# predict should have following schema
# payload:
# {inputs: { input_1: [],
#            input_2: [],
#          }
# }

# output payload:
# {output: { output_1: [],
#            output_2: [],
#          }
# }