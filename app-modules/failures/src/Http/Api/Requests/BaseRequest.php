<?php
namespace Dpb\Failures\Http\Api\Requests;

use Dpb\Failures\Http\Api\Concerns\HasRequestAuthorization;
use Illuminate\Foundation\Http\FormRequest;

abstract class BaseRequest extends FormRequest
{
    use HasRequestAuthorization;
}