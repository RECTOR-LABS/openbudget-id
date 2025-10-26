import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Openbudget } from "../target/types/openbudget";
import { expect } from "chai";

describe("OpenBudget.ID - Blockchain Infrastructure", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Openbudget as Program<Openbudget>;

  // Global PDAs
  let platformPda: anchor.web3.PublicKey;
  let platformBump: number;

  before(async () => {
    // Derive Platform PDA
    [platformPda, platformBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );
  });

  describe("Platform Initialization", () => {
    it("Initializes platform state", async () => {
      await program.methods
        .initializePlatform()
        .accounts({
          platformState: platformPda,
          admin: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const platformState = await program.account.platformState.fetch(platformPda);
      expect(platformState.admin.toString()).to.equal(provider.wallet.publicKey.toString());
      expect(platformState.projectCount.toNumber()).to.equal(0);
    });

    it("Fails to re-initialize platform", async () => {
      try {
        await program.methods
          .initializePlatform()
          .accounts({
            platformState: platformPda,
            admin: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("already in use");
      }
    });
  });

  describe("Project Creation", () => {
    const projectId = "KEMENKES-2025-001";
    let projectPda: anchor.web3.PublicKey;

    before(async () => {
      [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), Buffer.from(projectId)],
        program.programId
      );
    });

    it("Creates a project successfully", async () => {
      await program.methods
        .initializeProject(
          projectId,
          "Rural Health Clinic Construction",
          "Ministry of Health",
          new anchor.BN(5_000_000_000) // 5 billion IDR
        )
        .accounts({
          project: projectPda,
          platformState: platformPda,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const project = await program.account.project.fetch(projectPda);
      expect(project.id).to.equal(projectId);
      expect(project.title).to.equal("Rural Health Clinic Construction");
      expect(project.ministry).to.equal("Ministry of Health");
      expect(project.totalBudget.toNumber()).to.equal(5_000_000_000);
      expect(project.totalReleased.toNumber()).to.equal(0);
      expect(project.milestoneCount).to.equal(0);
      expect(project.authority.toString()).to.equal(provider.wallet.publicKey.toString());

      // Verify platform project count incremented
      const platformState = await program.account.platformState.fetch(platformPda);
      expect(platformState.projectCount.toNumber()).to.equal(1);
    });

    it("Prevents duplicate project IDs", async () => {
      try {
        await program.methods
          .initializeProject(
            projectId, // Same ID as above
            "Duplicate Project",
            "Some Ministry",
            new anchor.BN(1_000_000)
          )
          .accounts({
            project: projectPda,
            platformState: platformPda,
            authority: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.message).to.include("already in use");
      }
    });

    it("Validates input constraints - empty title", async () => {
      const invalidProjectId = "TEST-EMPTY-TITLE";
      const [invalidProjectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), Buffer.from(invalidProjectId)],
        program.programId
      );

      try {
        await program.methods
          .initializeProject(
            invalidProjectId,
            "", // Empty title
            "Some Ministry",
            new anchor.BN(1_000_000)
          )
          .accounts({
            project: invalidProjectPda,
            platformState: platformPda,
            authority: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidTitle");
      }
    });

    it("Validates input constraints - zero budget", async () => {
      const invalidProjectId = "TEST-ZERO-BUDGET";
      const [invalidProjectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), Buffer.from(invalidProjectId)],
        program.programId
      );

      try {
        await program.methods
          .initializeProject(
            invalidProjectId,
            "Valid Title",
            "Some Ministry",
            new anchor.BN(0) // Zero budget
          )
          .accounts({
            project: invalidProjectPda,
            platformState: platformPda,
            authority: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("InvalidBudget");
      }
    });

    it("Validates input constraints - project ID too long", async () => {
      const longProjectId = "A".repeat(33); // 33 characters

      try {
        // This will fail at PDA derivation since seed is too long (max 32 bytes per seed)
        const [invalidProjectPda] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("project"), Buffer.from(longProjectId)],
          program.programId
        );
        expect.fail("Should have thrown error at PDA derivation");
      } catch (err) {
        // Expected - Solana enforces max 32 byte seed length
        expect(err.message).to.include("Max seed length exceeded");
      }
    });
  });

  describe("Milestone Management", () => {
    const projectId = "KEMENKES-2025-001";
    let projectPda: anchor.web3.PublicKey;
    let milestone0Pda: anchor.web3.PublicKey;
    let milestone1Pda: anchor.web3.PublicKey;

    before(async () => {
      [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("project"), Buffer.from(projectId)],
        program.programId
      );

      [milestone0Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("milestone"), Buffer.from(projectId), Buffer.from([0])],
        program.programId
      );

      [milestone1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("milestone"), Buffer.from(projectId), Buffer.from([1])],
        program.programId
      );
    });

    it("Adds milestone to project", async () => {
      await program.methods
        .addMilestone(
          projectId,
          0, // First milestone (index 0)
          "Site preparation and foundation work",
          new anchor.BN(2_000_000_000) // 2 billion IDR
        )
        .accounts({
          milestone: milestone0Pda,
          project: projectPda,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const milestone = await program.account.milestone.fetch(milestone0Pda);
      expect(milestone.projectId).to.equal(projectId);
      expect(milestone.index).to.equal(0);
      expect(milestone.description).to.equal("Site preparation and foundation work");
      expect(milestone.amount.toNumber()).to.equal(2_000_000_000);
      expect(milestone.isReleased).to.equal(false);
      expect(milestone.releasedAt).to.equal(null);

      const project = await program.account.project.fetch(projectPda);
      expect(project.milestoneCount).to.equal(1);
    });

    it("Prevents exceeding budget", async () => {
      // Use milestone index 99 for this failing test so it doesn't interfere with subsequent tests
      const [tempMilestonePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("milestone"), Buffer.from(projectId), Buffer.from([99])],
        program.programId
      );

      try {
        await program.methods
          .addMilestone(
            projectId,
            99,
            "Exceeds budget milestone",
            new anchor.BN(4_000_000_000) // Would make total 6 billion, exceeding 5 billion budget
          )
          .accounts({
            milestone: tempMilestonePda,
            project: projectPda,
            authority: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("InsufficientBudget");
      }
    });

    it("Adds second milestone within budget", async () => {
      await program.methods
        .addMilestone(
          projectId,
          1,
          "Building construction and equipment",
          new anchor.BN(3_000_000_000) // Total: 5 billion (within budget)
        )
        .accounts({
          milestone: milestone1Pda,
          project: projectPda,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const project = await program.account.project.fetch(projectPda);
      expect(project.milestoneCount).to.equal(2);
    });

    it("Releases milestone funds", async () => {
      await program.methods
        .releaseFunds(
          projectId,
          0,
          "https://ipfs.io/ipfs/QmProofDocument123"
        )
        .accounts({
          milestone: milestone0Pda,
          project: projectPda,
          authority: provider.wallet.publicKey,
        })
        .rpc();

      const milestone = await program.account.milestone.fetch(milestone0Pda);
      expect(milestone.isReleased).to.equal(true);
      expect(milestone.releasedAt).to.not.equal(null);
      expect(milestone.proofUrl).to.equal("https://ipfs.io/ipfs/QmProofDocument123");

      const project = await program.account.project.fetch(projectPda);
      expect(project.totalReleased.toNumber()).to.equal(2_000_000_000);
    });

    it("Prevents double-release", async () => {
      try {
        await program.methods
          .releaseFunds(
            projectId,
            0, // Already released
            "https://ipfs.io/ipfs/QmAnotherDocument"
          )
          .accounts({
            milestone: milestone0Pda,
            project: projectPda,
            authority: provider.wallet.publicKey,
          })
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("MilestoneAlreadyReleased");
      }
    });

    it("Enforces authority check on add_milestone", async () => {
      const unauthorizedWallet = anchor.web3.Keypair.generate();

      // Airdrop some SOL to the unauthorized wallet for rent
      const airdropSig = await provider.connection.requestAirdrop(
        unauthorizedWallet.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSig);

      const [milestone2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("milestone"), Buffer.from(projectId), Buffer.from([2])],
        program.programId
      );

      try {
        await program.methods
          .addMilestone(
            projectId,
            2,
            "Unauthorized milestone",
            new anchor.BN(100_000)
          )
          .accounts({
            milestone: milestone2Pda,
            project: projectPda,
            authority: unauthorizedWallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([unauthorizedWallet])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("UnauthorizedAccess");
      }
    });

    it("Enforces authority check on release_funds", async () => {
      const unauthorizedWallet = anchor.web3.Keypair.generate();

      try {
        await program.methods
          .releaseFunds(
            projectId,
            1, // Not yet released
            "https://ipfs.io/ipfs/Unauthorized"
          )
          .accounts({
            milestone: milestone1Pda,
            project: projectPda,
            authority: unauthorizedWallet.publicKey,
          })
          .signers([unauthorizedWallet])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (err) {
        expect(err.toString()).to.include("UnauthorizedAccess");
      }
    });
  });
});
