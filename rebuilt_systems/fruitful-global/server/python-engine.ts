import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

export interface DeploymentConfig {
  sectorName: string;
  brandName: string;
  outputDir?: string;
  templateContent?: string;
}

export interface DeploymentResult {
  success: boolean;
  output: string;
  error?: string;
  generatedFiles: string[];
  deploymentId: string;
}

export class PythonDeploymentEngine {
  private pythonScriptPath: string = 'deployment_generator.py';
  private outputBaseDir: string = 'generated_pages';

  constructor() {
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await mkdir(this.outputBaseDir, { recursive: true });
      await mkdir('python_scripts', { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async initializePythonScript(pythonCode: string): Promise<void> {
    const scriptPath = path.join('python_scripts', this.pythonScriptPath);
    await writeFile(scriptPath, pythonCode, 'utf8');
    console.log('Python deployment script initialized');
  }

  async executeDeployment(config: DeploymentConfig): Promise<DeploymentResult> {
    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const outputDir = config.outputDir || path.join(this.outputBaseDir, deploymentId);
    
    try {
      await mkdir(outputDir, { recursive: true });

      // Prepare deployment configuration
      const deploymentConfigPath = path.join('python_scripts', `config_${deploymentId}.json`);
      const deploymentConfigData = {
        sector_name: config.sectorName,
        brand_name: config.brandName,
        output_dir: outputDir,
        deployment_id: deploymentId,
        template_content: config.templateContent
      };

      await writeFile(deploymentConfigPath, JSON.stringify(deploymentConfigData, null, 2), 'utf8');

      // Execute Python script
      const result = await this.runPythonScript(deploymentConfigPath);
      
      // Get generated files
      const generatedFiles = await this.getGeneratedFiles(outputDir);

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        generatedFiles,
        deploymentId
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        generatedFiles: [],
        deploymentId
      };
    }
  }

  private async runPythonScript(configPath: string): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise((resolve) => {
      const scriptPath = path.join('python_scripts', this.pythonScriptPath);
      const pythonProcess = spawn('python3', [scriptPath, configPath], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ 
            success: false, 
            output, 
            error: errorOutput || `Python script exited with code ${code}`
          });
        }
      });

      pythonProcess.on('error', (error) => {
        resolve({
          success: false,
          output,
          error: error.message
        });
      });
    });
  }

  private async getGeneratedFiles(outputDir: string): Promise<string[]> {
    try {
      const files: string[] = [];
      const readDirectory = async (dir: string): Promise<void> => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await readDirectory(fullPath);
          } else {
            files.push(path.relative(this.outputBaseDir, fullPath));
          }
        }
      };
      await readDirectory(outputDir);
      return files;
    } catch (error) {
      console.error('Error reading generated files:', error);
      return [];
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<{ exists: boolean; files: string[] }> {
    const deploymentDir = path.join(this.outputBaseDir, deploymentId);
    try {
      const files = await this.getGeneratedFiles(deploymentDir);
      return { exists: true, files };
    } catch {
      return { exists: false, files: [] };
    }
  }

  async getGeneratedFileContent(deploymentId: string, fileName: string): Promise<string | null> {
    try {
      const filePath = path.join(this.outputBaseDir, deploymentId, fileName);
      const content = await readFile(filePath, 'utf8');
      return content;
    } catch {
      return null;
    }
  }
}

export const pythonEngine = new PythonDeploymentEngine();