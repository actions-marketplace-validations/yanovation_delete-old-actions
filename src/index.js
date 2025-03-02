import * as core from '@actions/core';
import * as github from '@actions/github';
export async function getWorkflowRuns(token) {
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    return await octokit.paginate(octokit.rest.actions.listWorkflowRunsForRepo, {
        owner,
        repo,
        per_page: 100,
    });
}
export function groupRunsByWorkflow(runs) {
    return runs.reduce((acc, run) => {
        acc[run.workflow_id] = acc[run.workflow_id] || [];
        acc[run.workflow_id].push(run);
        return acc;
    }, {});
}
export function filterRuns(runs, cutoffDate, keepLatest) {
    runs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return runs.slice(keepLatest).filter(run => new Date(run.created_at) < cutoffDate);
}
export async function deleteWorkflowRuns(token, runsToDelete, dryRun) {
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    let deletions = 0;
    for (const run of runsToDelete) {
        if (dryRun) {
            core.info(`[Dry-Run] Would delete workflow run ID ${run.id} from ${run.created_at}`);
        }
        else {
            await octokit.rest.actions.deleteWorkflowRun({
                owner,
                repo,
                run_id: run.id,
            });
            core.info(`Deleted workflow run ID ${run.id} from ${run.created_at}`);
            deletions++;
        }
    }
    return deletions;
}
export async function run() {
    try {
        const token = core.getInput('token', { required: true });
        const daysAgo = parseInt(core.getInput('days-ago', { required: true }));
        const dryRun = core.getBooleanInput('dry-run');
        const keepLatest = parseInt(core.getInput('keep-latest')) || 0;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        core.info(`Fetching workflow runs older than ${cutoffDate.toISOString()}...`);
        const runs = await getWorkflowRuns(token);
        const runsByWorkflow = groupRunsByWorkflow(runs);
        let totalDeletions = 0;
        for (const [workflowId, workflowRuns] of Object.entries(runsByWorkflow)) {
            const runsToDelete = filterRuns(workflowRuns, cutoffDate, keepLatest);
            console.debug(`Workflow ${workflowId} has ${runsToDelete.length} runs to be deleted.`);
            const deletedCount = await deleteWorkflowRuns(token, runsToDelete, dryRun);
            totalDeletions += deletedCount;
        }
        core.info(`Total workflow runs deleted: ${totalDeletions}`);
    }
    catch (error) {
        core.setFailed(error instanceof Error ? error.message : 'Unknown error');
    }
}
if (require.main === module) {
    run().catch(e => core.setFailed(e));
}
