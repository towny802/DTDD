import fs from 'fs';
import path from 'path';
export module TypeManifest {

    export function importModule(filePath: string) {
        const fullPath = path.resolve(filePath);
        // Require the module synchronously (Node.js only)
        const module = require(fullPath);
        return module.TypeSpace; // Assuming TypeSpace is exported
      }

    function isClass(obj: any) {
        return typeof obj === 'function' && obj.prototype && obj.prototype.constructor.name !== 'Object';
    }

    export function getClassesInFolder(folderPath: string) {
        const classes: { [key: string]: any } = {};

        try {
            const files = fs.readdirSync(folderPath);

            for (const file of files) {
                const filePath = path.resolve(folderPath, file);
                const stats = fs.statSync(filePath);

                if (stats.isFile() && filePath.endsWith('.ts')) {
                    const module = importModule(filePath);
                    for (const key in module) {
                        if (key !== 'default' && isClass(module[key])) {
                            classes[key] = module[key];
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error reading directory:', err);
        }

        return classes;
    }

    export function createInstances(classes: { [key: string]: any }): { [key: string]: any } {
        const instances: { [key: string]: any } = {};
        for (const key in classes) {
            instances[key] = new classes[key]();
        }
        return instances;
    }

    function main() {
        const folderPath = './Models'; 
        const classes = getClassesInFolder(folderPath);
        const instances = createInstances(classes);
        console.log('Instances:', Object.keys(instances));
        console.log('Instances:', instances["W2TaxReturn"]);
    }
    
    main();
      
    
}
