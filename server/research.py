import requests
import os
from typing import Optional

BASE_API_URL = os.getenv('BASE_API_URL')
LANGFLOW_ID = os.getenv('LANGFLOW_ID')
FLOW_ID = os.getenv('FLOW_ID')
APPLICATION_TOKEN = os.getenv('APPLICATION_TOKEN')
LANGFLOW_ENDPOINT = os.getenv('LANGFLOW_ENDPOINT')

DEFAULT_TWEAKS = {
    "Prompt-IeW7V": {
        "previous_response": "",
        "template": "\n\nRESEARCH PLAN: {previous_response}\n\nUse Tavily Search to investigate the queries and analyze the findings.\nFocus on academic and reliable sources.\n\nSteps:\n1. Search using provided queries\n2. Analyze search results\n3. Verify source credibility\n4. Extract key findings\n\nFormat findings as:\n\nSEARCH RESULTS:\n[Key findings from searches]\n\nSOURCE ANALYSIS:\n[Credibility assessment]\n\nMAIN INSIGHTS:\n[Critical discoveries]\n\nEVIDENCE QUALITY:\n[Evaluation of findings]",
        "tool_placeholder": ""
    },
    "TavilySearchComponent-xDlkf": {
        "api_key": os.getenv('TAVILY_API_KEY'),
        "include_answer": True,
        "include_images": True,
        "max_results": 5,
        "search_depth": "advanced",
        "topic": "general"
    }
}

if not APPLICATION_TOKEN:
    raise ValueError("APPLICATION_TOKEN must be set in .env file")

def run_flow(message: str,
    endpoint: str = FLOW_ID,
    output_type: str = "chat",
    input_type: str = "chat",
    tweaks: Optional[dict] = None,
    application_token: Optional[str] = None) -> dict:
    
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{endpoint}"
    
    final_tweaks = DEFAULT_TWEAKS.copy()
    if tweaks:
        final_tweaks.update(tweaks)

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
        "tweaks": final_tweaks
    }
    
    headers = None
    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}
    
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {str(e)}")
        if hasattr(e.response, 'text'):
            print(f"Response text: {e.response.text}")
        raise Exception(f"Langflow API error: {str(e)}")
