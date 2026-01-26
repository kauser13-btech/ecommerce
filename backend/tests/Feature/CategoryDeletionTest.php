<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_promotes_subcategories_when_parent_is_deleted()
    {
        $parent = Category::create([
            'name' => 'Parent Category',
            'slug' => 'parent-category',
        ]);

        $child1 = Category::create([
            'name' => 'Child Category 1',
            'slug' => 'child-category-1',
            'parent_id' => $parent->id,
        ]);

        $child2 = Category::create([
            'name' => 'Child Category 2',
            'slug' => 'child-category-2',
            'parent_id' => $parent->id,
        ]);

        // Act
        $response = $this->deleteJson("/api/categories/{$parent->id}");

        // Assert
        $response->assertStatus(200);

        $this->assertDatabaseMissing('categories', ['id' => $parent->id]);
        
        $this->assertDatabaseHas('categories', [
            'id' => $child1->id,
            'parent_id' => null,
        ]);

        $this->assertDatabaseHas('categories', [
            'id' => $child2->id,
            'parent_id' => null,
        ]);
    }
}
