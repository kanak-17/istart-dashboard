import json
from collections import defaultdict

# Paste your full data into this dictionary
topics = {
    "Additional Booster": [
        "Additional Booster is extra help or support given by iStart if your startup performs well, like more funding, mentorship, or visibility.",
        "The \"Additional Booster\" is extra support offered to select startups under iStart Rajasthan. It provides added benefits or funding based on performance and eligibility criteria to further accelerate your growth.",
        "Additional Booster is an extra push given to high-potential startups through extended support like funding top-ups, exclusive resources, or continued mentoring under special provisions.",
        "Extra rewards for startups that do really well - like bonus money or special recognition."
    ],
    "Booster": [
        "A booster refers to extra help provided to strong startups—such as additional funding, expedited support, or specialized guidance — to help them grow rapidly.",
        "In iStart Rajasthan, \"Booster\" schemes refer to special incentives or support mechanisms like funding, mentorship, or business services provided to startups to give them a growth push.",
        "Booster programs are initiatives under iStart designed to accelerate the startup’s journey by providing focused support, be it funding, recognition, or fast-track access to services.",
        "Quick help given to startups when they need a push to grow faster."
    ],
    # Add all remaining items following the same format
}

# Convert to structured JSON
output_json = defaultdict(list)
for topic, answers in topics.items():
    for idx, answer in enumerate(answers, start=1):
        output_json[topic].append({
            "Answer": f"Answer {idx}",
            "Text": answer
        })

# Output the formatted JSON
json_str = json.dumps(output_json, indent=2)
print(json_str)
