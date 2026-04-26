<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->user()->can('project.view') ?: abort(403);

        $projects = Project::query()
            ->with('creator:id,name')
            ->when($request->string('q')->value(), function ($query, string $q) {
                $query->where(function ($inner) use ($q) {
                    $inner->where('name', 'like', "%{$q}%")
                        ->orWhere('nomor_spk', 'like', "%{$q}%")
                        ->orWhere('p2_organisasi', 'like', "%{$q}%");
                });
            })
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return (new ProjectResource($project->load('creator:id,name')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Project $project): ProjectResource
    {
        $request->user()->can('project.view') ?: abort(403);

        return new ProjectResource($project->load('creator:id,name'));
    }

    public function update(UpdateProjectRequest $request, Project $project): ProjectResource
    {
        $project->update($request->validated());

        return new ProjectResource($project->load('creator:id,name'));
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $request->user()->can('project.delete') ?: abort(403);

        $project->delete();

        return response()->json(['message' => 'Project dihapus.']);
    }
}
