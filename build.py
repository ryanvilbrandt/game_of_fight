from jinja2 import Environment, FileSystemLoader

JINJA_ENVIRONMENT = Environment(loader=FileSystemLoader("."), autoescape=True)
template = JINJA_ENVIRONMENT.get_template("template.tpl")
with open("index.html", "wb") as f:
    f.write(bytes(template.render(), "utf-8"))
