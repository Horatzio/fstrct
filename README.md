# Introduction

Welcome to 'fstrct', a Visual Studio Code extension with the goal of helping developers manage the file and folder structure within their projects. This is an ambitious development that is currently ongoing, but we are excited to share it with you and hope it will become a valuable tool for your workflow. With 'fstrct', you will be able to easily organize the files and directories in your projects, saving you time and increasing your productivity. 
We hope the idea behind 'fstrct' interests and look forward to your feedback as we continue to improve and expand its capabilities.

The reason behind the inception of this project is to drive clean coding standards even further.
The most popular readily available tool right now is eslint, used for enforcing anything from formatting to code practices.
However, there is one feature that is not encompassed, that being file name and folder structure enforcement.

The goal of 'fstrct' is to provide developers with a method to formalize the file naming and folder structure conventions in their project, and to automatically enforce this standard for all contributors of a codebase.

### Planned Features

- Configure the folder structure through a file `fstrct.json`
- A TreeView specific for viewing the Folder Structure (**Fstrct View**)
- **Fstrct View** clearly displays if a file's name does not respect the predefined  folder structure rules
- **Fstrct View** clearly displays if a folder's name does not respect the predefined  folder structure rules
- `fstrct.json` allows the possibility to define a *fixed* folder structure
- **Fstrct View** clearly displays *missing* folders/files when using a *fixed* folder structure
- A command to automatically scaffold files and folders according to the `fstrct.json` structure

## Workflow Example

1. Define `fstrct.json`

```json
// fstrct.json
{
    "root": "./src",
    "caseSensitiveNames": false,
    "structure": {
        "kebabCaseWord": {
            "name": "\\w+[-\\w\\d]+(\\w|\\d)",
            "description": "Regex matching a kebab case name containing letters and digits, but starting only with a letter and not ending with a hypen",
            "type": "RegexVarDefinition"
        },
        "featureFolder": {
            "name": "($kebabCaseWord)",
            "type": "Folder",
            "required": true,
            "content": {
                "modelFolder": {
                    "name": "model",
                    "type": "Folder",
                    "required": false,
                    "content": {
                        "modelFile": {
                            "name": "($kebabCaseWord).model.ts",
                            "type": "File"
                        }
                    },
                    "content": {
                        "dtoFile": {
                            "name": "($kebabCaseWord).dto.ts",
                            "type": "File"
                        }
                    }
                },
                "serviceFolder": {
                    "name": "service",
                    "type": "Folder",
                    "required": true,
                    "content": {
                        "serviceFile": {
                            "name": "($kebabCaseWord).service.ts",
                            "type": "File"
                        }
                    }
                }
            }
        }
    }
}
```

Sample folder structure

```
├── src
│   ├── authentication // valid, service and model folders are contained
│   │   ├── service
│   │   │   ├── auth.service.ts
│   │   │   └── forgot-password.service.ts
│   │   └── model
│   │       ├── login.dto.ts
│   │       └── user.model.ts
│   └── newsletter-notification // valid, yet 'service' folder is displayed as available to add
│       ├── model
│       │   └── newsletter-email.viewmodel.ts // invalid, file name does not match rule
│       └── ~service~
│
├── node_modules
├── package.json
├── package-lock.json
├── fstrct.json
├── .eslintrc
└── .gitignore
```




## Aspiring Features
Not planned for initial v1.0.0

- Support nested `fstrct.json` files
- Support **File Templates** defining both naming convention and *file content*
- When editing a file with a corresponding **File Template** display differences between file and template

<!-- ## Requirements -->

<!-- ## Extension Settings

## Known Issues

[NOT RELEASED YET]

## Release Notes

[NOT RELEASED YET]

**Enjoy!** -->
