<?php

namespace Dpb\Failures\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Foundation\Auth\User as AuthUser;
use Laravel\Sanctum\HasApiTokens;

#[Table('users')]
#[Fillable(['uuid', 'name', 'personal_number', 'email', 'password'])]
class User extends AuthUser
{
    use HasApiTokens;

    public function getId(): int
    {
        return (int) $this->getAttribute('id');
    }

    public function getUuid(): string
    {
        return (string) $this->getAttribute('uuid');
    }

    public function setUuid(
        string $uuid
    ): static {
        $this->setAttribute('uuid', $uuid);
        return $this;
    }

    public function getName(): string
    {
        return (string) $this->getAttribute('name');
    }

    public function setName(
        string $name
    ): static {
        $this->setAttribute('name', $name);
        return $this;
    }

    public function getPersonalNumber(): string
    {
        return (string) $this->getAttribute('personal_number');
    }

    public function setPersonalNumber(
        string $personalNumber
    ): static {
        $this->setAttribute('personal_number', $personalNumber);
        return $this;
    }

    public function getEmail(): ?string
    {
        $email = $this->getAttribute('email');
        return $email ? (string) $email : null;
    }

    public function setEmail(
        ?string $email
    ): static {
        $this->setAttribute('email', $email);
        return $this;
    }

    public function getPassword(): string
    {
        return (string) $this->getAttribute('password');
    }

    public function setPassword(
        string $password
    ): static {
        $this->setAttribute('password', $password);
        return $this;
    }
}