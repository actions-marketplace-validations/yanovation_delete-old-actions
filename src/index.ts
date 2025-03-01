import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const token: string = core.getInput('token', { required: true });
    const daysAgo: number = parseInt(core.getInput('days-ago', { required: true }));
    const dryRun: boolean = core.getBooleanInput('dry-run');
    const keepLatest: number = parseInt(core.getInput('keep-latest')) || 0;

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    core.info(`Fetching workflow runs older than ${cutoffDate.toISOString()}...`);
    const response = await octokit.paginate(octokit.rest.actions.listWorkflowRunsForRepo, {
      owner,
      repo,
      per_page: 100,
    });

    // Use proper TypeScript type
    type WorkflowRun = {
      id: number;
      created_at: string;
      workflow_id: number;
    };

    const runsByWorkflow: Record<string, WorkflowRun[]> = {};
    for (const run of response as WorkflowRun[]) {
      if (!runsByWorkflow[run.workflow_id]) {
        runsByWorkflow[run.workflow_id] = [];
      }
      runsByWorkflow[run.workflow_id].push(run);
    }

    let deletions = 0;
    for (const [workflowId, runs] of Object.entries(runsByWorkflow)) {
      runs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const runsToDelete = runs.slice(keepLatest).filter(run => new Date(run.created_at) < cutoffDate);

      for (const run of runsToDelete) {
        if (dryRun) {
          core.info(`[Dry-Run] Would delete workflow run ID ${run.id} from ${run.created_at}`);
        } else {
          await octokit.rest.actions.deleteWorkflowRun({
            owner,
            repo,
            run_id: run.id,
          });
          core.info(`Deleted workflow run ID ${run.id} from ${run.created_at} for the workflow ID: ${workflowId}`);
          deletions++;
        }
      }
    }

    core.info(`Total workflow runs deleted: ${deletions}`);
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Unknown error');
  }
}

run()
  .then(() => {})
  .catch(e => core.setFailed(e));
