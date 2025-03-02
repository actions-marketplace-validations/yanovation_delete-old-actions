import { filterRuns, groupRunsByWorkflow } from '../src/index';

describe('groupRunsByWorkflow', () => {
  it('groups runs correctly by workflow_id', () => {
    const mockRuns = [
      { id: 1, created_at: '2024-02-01T00:00:00Z', workflow_id: 100 },
      { id: 2, created_at: '2024-02-02T00:00:00Z', workflow_id: 200 },
      { id: 3, created_at: '2024-02-03T00:00:00Z', workflow_id: 100 },
    ];

    const result = groupRunsByWorkflow(mockRuns);
    expect(result).toEqual({
      '100': [
        { id: 1, created_at: '2024-02-01T00:00:00Z', workflow_id: 100 },
        { id: 3, created_at: '2024-02-03T00:00:00Z', workflow_id: 100 },
      ],
      '200': [{ id: 2, created_at: '2024-02-02T00:00:00Z', workflow_id: 200 }],
    });
  });
});

describe('filterRuns', () => {
  const mockRuns = [
    { id: 1, created_at: '2024-02-01T00:00:00Z', workflow_id: 100 },
    { id: 2, created_at: '2024-02-02T00:00:00Z', workflow_id: 100 },
    { id: 3, created_at: '2024-02-03T00:00:00Z', workflow_id: 100 },
  ];

  it('filters out old runs correctly while keeping the latest', () => {
    const cutoffDate = new Date('2024-02-02T00:00:00Z');
    const runsToDelete = filterRuns(mockRuns, cutoffDate, 1);

    expect(runsToDelete).toEqual([{ id: 1, created_at: '2024-02-01T00:00:00Z', workflow_id: 100 }]);
  });

  it('keeps all runs if they are newer than cutoff', () => {
    const cutoffDate = new Date('2024-01-01T00:00:00Z');
    const runsToDelete = filterRuns(mockRuns, cutoffDate, 1);

    expect(runsToDelete).toEqual([]);
  });
});
